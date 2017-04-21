#!/bin/sh

# This script will automate creating versioned releases:
# 
# 1. compile a production build of the CMS, using latest the 
#    source from the master  branch
#  
# 2. build a .deb of the compiled CMS, for easy install on the 
#    live server (which must be able to install/convert .deb pkgs)
# 
# 3. update a 'releases' branch, which contains all our CMS builds
#    with the new build output (each commit is a new release/build) 
# 
# 4. you should then go to the Github Releases page and manually create 
#    a Github release from the latest commit in the 'releases' branch
#
# NOTE: You MUST use the 'releases' branch tp create the releases, 
# as it is the only branch which contains the compiled CMS builds,
# without source (all other branches contain the source only).


#
# Only run this script once you have committed a version to master
# on Github that is good for a release build.
# 
# A release is a build which ready to be installed on the live 
# environment (AWS etc)  and gets its own version number and a 
# release page on github.
#
# You should create versioned releases after doing lots of bug fixing, 
# and not straight after adding new, untested features.

set -a 

USAGE="Usage: release.sh VERSION 'release message'

  Example: release.sh 3.1.0 'new UI interface'

  NOTE: Do not include 'v' before the "

VER="$1"
MSG="$2"

# log errors to stdout
error() {
  echo "$1"
  exit 1
}

# error if we got some empty opions
if [ "${VER}" = "" -o "$MSG" = "" ];then
  error "$USAGE"
fi


echo # begin script

# make sure we are building the latest CMS version from the right branch
git checkout master || error "Failed finding master branch"
echo

# get the hash of the latest master commit.. We will link to it from our 
# releases branch commit, so we know from which source version our release 
# was built
HASH=$(git rev-parse --short HEAD)

# build latest version of CMS
rm -rf www/* && brunch b --production || error "Failed brunch build"

cd build

# remove old files 
rm -rf "Project-cms_"${VER}"_all/"

# copy template folder into a build $VER folder
cp -Rf Project-cms_VER_all "Project-cms_"${VER}"_all" || error "Failed to create package dir"

# go to project root
cd ..

# copy latest builds of www/index.php and www/demo/ into build folder
cp www/index.php "build/Project-cms_"${VER}"_all/var/www/html/index.php"  || error "Failed to add index.php"
cp -Rf www/demo "build/Project-cms_"${VER}"_all/var/www/html/demo"  || error "Failed to add /demo/"

# update DEBIAN/control (update version number)
sed -i "s/Version: VER/Version: $VER/" "build/Project-cms_"${VER}"_all/DEBIAN/control"

# update the md5s in DEBIAN/md5sums
find www/demo/ -type f | while read line; do md5sum ${line} | sed 's/www/var\/www\/html/' >> "build/Project-cms_"${VER}"_all/DEBIAN/md5sums";  done

# append version info to DEBIAN/control description 
echo "
 .
 v"${VER}": $MSG" >> "build/Project-cms_"${VER}"_all/DEBIAN/control"

# we don't have a Dev Ops department to build and deploy our packages 
# for us, so let's cheat a little bit:
#
# we log into our VM with `vagrant ssh`, then build our pkg from there, 
# cos our VM is an ubuntu machine, based our live env .. This means they 
# have the same package managers, same .deb pkg types, archs, deps, etc

# so lets login into our vagrant VM, so we can build a pkg compatible 
# with our live env (which our vagrant VM is based on). The pkg we 
# build can then be installed on the live env using the package manager, 
# which gives us good control over upgrades and rollbacks. etc
vagrant ssh << RUN
  # go to project root 
  cd /vagrant
  # now build the .deb of the given version
  cd build/
  echo
  echo "Building Package: "
  dpkg-deb -b "Project-cms_"${VER}"_all" || echo "Failed building .deb"
  # leave vagrant
RUN

# remove our tmp build dir, we don't want it any more
rm -rf "build/Project-cms_"${VER}"_all/"

# now we need to commit this CMS build to a releases branch, 
# where each commit is a compiled CMS build linked to a 
# versioned, downloadable GitHub release (on the releases page).
#

# copy master build output to a tmp dir
mkdir -p /tmp/project-cms-build/www/
rm -rf /tmp/project-cms-build/www/*
cp -R www/* /tmp/project-cms-build/www/

# go to release branch
echo
git checkout releases

# now replace the old release build with the new one we put in /tmp
rm -rf www/*
cp -R /tmp/project-cms-build/www/* www/

# now we add the latest CMS build output to the releases branch
echo
git add -f www/index.php www/demo/
git status
git commit -m "new release v"${VER}", built from master commit ${HASH}: ${MSG}"
git push origin releases

# return to our previous branch (master)
git checkout master

# we will use the commit we just made to `releases` to make our 
# github release downloads page as well.. tell the user how to do it:
echo "
Done!

Now you should:

1. visit the Github releases page 
2. click 'Draft a new release'
3. add the tag 'v"${VER}"', and CHOOSE THE 'releases' BRANCH
4. attach the 'build/Project-cms_"${VER}"_all.deb' file
5. publish the release"

exit 0

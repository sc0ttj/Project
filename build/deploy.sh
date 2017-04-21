#!/bin/sh

# This file should be executed from the project root
# 
# usage:   deploy.sh [version]  [path/to/file.pem]  [user@address]
# 
# example: deploy.sh 1.1.1  my-key-file.pem  root@ec2-72-94-62-87.compute-1.amazonaws.com

# Set up command line options

VER=$1    # the version to install (dont include the leading 'v')
CERT=$2   # the path to your private key file (filename.pem)
ADDR=$3   # the user and address, such as root@ec2-72-94-62-87.compute-1.amazonaws.com


USAGE="deploy.sh:

Deploys the given version of 'Project-cms_VER_all.deb' to the given 
remote server, using scp, then intalls it using ssh and dpkg.

Usage:    deploy.sh [version] [path/to/file.pem] [user@address]

Example:  deploy.sh 1.3.6 mykeyfile.pem root@ec2-72-94-62-87.compute-1.amazonaws.com"

#
# log errors to stdout
error() {
  echo
  echo "ERROR:  $1"
  exit 1
}

# we should to be in the master branch
git checkout master

#
# validation
if [ "${VER}" = "" -o "${CERT}" = "" -o "${ADDR}" = "" ];then
  error "$USAGE"
fi


# check for deb file
if [ ! -f "build/Project-cms_"${VER}"_all.deb" ];then
  error "Cannot find 'Project-cms_"${VER}"_all.deb'.

Make sure you are in the project root when you run this 
script, and the version you give actually exists."
fi

# check for cert file
if [ ! -f "${CERT}" ];then
  error "Cannot find the certificate file '$CERT'.

Make sure you have given the correct path to your private key file."
fi


#
# if we got to this stage, we should be good - we have a cert 
# file, and we have a deb file, so let's attempt to copy the 
# file to live environment

# copy to our live environment
echo
echo "-----------------------------------
Copying package to $ADDR"
scp -i "$CERT" "build/Project-cms_"${VER}"_all.deb" ${ADDR}:~/ || error "Could not copy package to remote server"


# Now, we'll SSH into our live env machine, and install the package:
echo
echo "-----------------------------------
Logging into server.."

ssh -i "$CERT" "$ADDR" << RUN
  # remove annoying welcome ssh msg
  touch ~/.hushlogin
  # install the package - note it will not install unless the 
  # deps are met (the deps are: apache2, php5)
  echo
  echo "Installing Package.."
  sudo dpkg -i "Project-cms_"${VER}"_all.deb" && sudo apt-get install -qqyf
  # show the version we just installed on the live env
  echo
  echo "-----------------------------------"
  echo
  echo "Package version $VER installed OK!"
  # make folders 777 - enables CMS uploads
  sudo chmod 777 /var/www/html/demo
  sudo chmod 777 /var/www/html/demo/images
  sudo chmod 777 /var/www/html/demo/videos
  sudo chmod 777 /var/www/html/demo/vocabs
  sudo chmod 777 /var/www/html/downloads
RUN


# Finished
echo "
-----------------------------------

Done!

You have just installed Project-cms version $VER to the live server.
"

exit 0
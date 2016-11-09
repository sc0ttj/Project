#!/bin/bash

set -a

# log errors to stdout
build_error() {
	echo
	echo "Error: $1"
	echo "Check ${HOME}/ to see downloaded programs."
	echo "Check ${HOME}/Project/ to see downloaded project"
	exit 1
}

cd $HOME

# To do: actual installation of stuff
#    - install curl, brew, etc
#    - then install stuff below

# for now, tell user what to install
echo "Install SUBLIME 3"
echo "Install VAGRANT"
echo "Install VBOX"
echo "Install CHROME"
echo "Install GIT"
echo "Install NodeJS "
echo "Install NPM"
echo "Install https://github.com/sc0ttj/Project to ~/Project/"

exit 0

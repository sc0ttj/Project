#!/bin/bash

set -a

WORKDIR="`pwd`"

# log errors to stdout
build_error() {
	echo
	echo "Error: $1"
	echo "Check ${HOME}/Downloads to see downloaded programs."
	echo "Check $WORKDIR to see downloaded project"
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

exit 0

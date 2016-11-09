#!/bin/bash

set -a

BOLD="\e[1m"
RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"
BLUE="\e[34m"
COL_END="\e[0m"


# log errors to stdout
error() {
	echo -e "${RED}"
	echo "Error: $1"
	echo -e "${COL_END}"
	exit 1
}

# check for compatible OS
function check_if_ubuntu() {
	if [ ! -f /etc/os-release ];then
		OS="$(gcc --version | head -1 | cut -f2 -d' ' | tr -d '('  | tr '[:upper:]' '[:lower:]')"
	else
		OS="$(sudo cat /etc/os-release | cut -f2 -d'=' | tr -d '"' | grep ^ubuntu)"
	fi

	if [ "$OS" != "ubuntu" ];then
		error "OS is not Ubuntu, exiting..."
		exit 1
	fi
}

check_if_ubuntu

source ~/.profile
source ~/.bashrc
clear 
cd $HOME

# make download dir
[ ! -d ${HOME}/Downloads ] && mkdir -p ${HOME}/Downloads

#----------------------------------------------------

echo -e $BOLD
echo "-------- HOST ENVIRONMENT SETUP --------"
echo -e $COL_END

# start installation

echo "1. Updating package list to latest"
sudo apt-get -qq update
cd ${HOME}/Downloads
echo



echo "2. Installing required packages"
# sublime
if [ "`which subl`" = "" ] ;then
	echo 'Installing Sublime Text 3...'
	wget -c https://download.sublimetext.com/sublime-text_build-3126_amd64.deb
	sudo dpkg -i sublime-text_build-3126_amd64.deb || error "Sublime was not installed"
fi
SUBLIME_VERSION=$(subl --version)

# vagrant
if [ "`which vagrant`" = "" ] ;then
	echo 'Installing Vagrant...'
	wget -c https://releases.hashicorp.com/vagrant/1.8.7/vagrant_1.8.7_x86_64.deb
	sudo dpkg -i vagrant_1.8.7_x86_64.deb || error "Vagrant was not installed"
fi
VAGRANT_VERSION=$(vagrant --version)

# virtualbox
if [ "`which vboxheadless`" = "" ] ;then
	echo 'Installing VirtualBox...'
	sudo apt-get -qq install virtualbox -y || error "VirtualBox was not installed"
fi
VBOX_VERSION=$(vboxheadless --version | head -1)

# google chrome
if [ "`which google-chrome-stable`" = "" ] ;then
	echo 'Installing Google Chrome...'
	sudo echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/sources.list
	wget -C -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
	sudo apt-key add linux_signing_key.pub
	sudo apt update -qq
	sudo apt install google-chrome-stable -y || error "Google Chrome was not installed"
fi
CHROME_VERSION=$(google-chrome-stable -version)

# git
if [ "`which git`" = "" ] ;then
	echo 'Installing Git...'
	sudo apt-get -qq install git -y || error "Git was not installed"
fi
GIT_VERSION=$(git --version)

# ruby
if [ "`which ruby`" = "" ] ;then
	echo 'Installing Ruby...'
	sudo apt-get -qq install ruby -y || error "Ruby was not installed"
fi
RUBY_VERSION=$(ruby --version)

# bundler
if [ "`which bundler`" = "" ] ;then
	echo 'Installing Bundler...'
	sudo apt-get -qq install bundler -y || error "Bundler was not installed"
fi
BUNDLER_VERSION=$(bundler --version)

# nodejs
if [ "`which nodejs`" = "" ] ;then
	echo 'Installing NodeJS...'
	sudo apt-get -qq install nodejs -y || error "NodeJS was not installed"
fi
[ ! -x /usr/bin/node ] && sudo ln -s /usr/bin/nodejs /usr/bin/node
NODEJS_VERSION=$(nodejs --version)

# npm
if [ "`which npm`" = "" ] ;then
	echo 'Installing NPM...'
	sudo apt-get -qq install npm -y || error "NPM was not installed"
fi
NPM_VERSION=$(npm --version)

# fix npm permission
mkdir ~/.npm-global &>/dev/null
npm config set prefix '~/.npm-global'
if [ "`cat ~/.bashrc | grep 'export PATH=~/.npm-global/bin:$PATH'`" = "" ];then
	echo "" >>  ~/.bashrc
	echo "" >>  ~/.bashrc
	echo "# npm permission fix" >>  ~/.bashrc
	echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
fi
[ ! -f ~/.profile ] && touch ~/.profile
if [ "`cat ~/.profile | grep 'export PATH=~/.npm-global/bin:$PATH'`" = "" ];then
	echo "" >>  ~/.profile
	echo "" >>  ~/.profile
	echo "# npm permission fix" >>  ~/.profile
	echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
fi
source ~/.profile
source ~/.bashrc

# global npm packages
if [ "`which npm`" != "" ] ;then
	npm config set loglevel warn
	# [ "`which eslint`" = "" ] 		&& npm install -g eslint
	# [ "`which csslint`" = "" ] 		&& npm install -g csslint
	# [ "`which phantomjs`" = "" ] 	&& npm install -g phantomjs
fi
# ESLINT_VERSION=$(eslint --version)
# CSSLINT_VERSION=$(csslint --version)
# PHANTOMJS_VERSION=$(phantomjs --version)


# final output
echo 
echo "  Installed: "
echo "    $SUBLIME_VERSION"
echo "    $VAGRANT_VERSION"
echo "    $VBOX_VERSION"
echo "    $CHROME_VERSION"
echo "    $GIT_VERSION"
echo "    $RUBY_VERSION"
echo "    $BUNDLER_VERSION"
echo "    NodeJS $NODEJS_VERSION"
echo "    NPM $NPM_VERSION"
# echo "    ESLint $ESLINT_VERSION"
# echo "    CSSLint $CSSLINT_VERSION"
# echo "    PhantomJS $PHANTOMJS_VERSION"
echo


# clean up
echo "3. Cleaning packages"
sudo apt-get -qq autoremove
sudo apt-get -qq clean
echo 



echo "4. Setting up the project source code"
echo
cd ${HOME}/Project
# TODO git clone [URL] .
[ -f package.json ] && npm install
[ -f bower.json ] && bower update
[ -f Gemfile ] && bundler
echo



echo "5. Setting up vagrant"
echo
VAGRANT_BOX=$(vagrant box list | cut -f1 -d' ' | grep 'ubuntu/trusty64')
if [ "$VAGRANT_BOX" = "" ];then
	echo -e "  Installing ${BOLD}'ubuntu/trusty64'${COL_END} vagrant box..."
	vagrant box add ubuntu/trusty64 || error "Could not install vagrant box 'ubuntu/trusty'"
else 
	echo -e "  Vagrant box ${BOLD}'ubuntu/trusty64'${COL_END} already installed."
fi
echo -e "  Starting vagrant.. Please wait..."
[ -f Vagrantfile ] || error "Could not find ${HOME}/Project/Vagrantfile"
# create a log file
rm /tmp/vagrant.log &>/dev/null
touch /tmp/vagrant.log
# now (re)start vagrant
vagrant halt &>/dev/null
vagrant up --provision &>/tmp/vagrant.log || error "Could not start up vagrant box. Run 'cat /tmp/vagrant.log'"
echo -e "  Vagrant loaded successfully."


#------------------------------------------------------

echo -e "$GREEN $BOLD
Setup Complete $COL_END

  Watch project changes:		$YELLOW brunch watch & $COL_END  
  Edit the code in: 			$BLUE ${HOME}/Project/app $COL_END
  View the code at: 			$BLUE http://localhost:8080/ $COL_END

---------------------------------------------------------

From now on, you can just run:

    $YELLOW cd ~/Project && vagrant up $COL_END

If you cant see your code changes in the browser, 
delete your browser cache, then run:

	$YELLOW cd ~/Project; vagrant halt; vagrant up --provision $COL_END

Now refresh http://localhost:8080 in your browser.

---------------------------------------------------------

Finished.
"

exit 0

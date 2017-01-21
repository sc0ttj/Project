# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "ubuntu/trusty64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder "www", "/var/www/html", id: "vagrant-root", :owner => "www-data", :group => "www-data", mount_options: ["dmode=775,fmode=664"]

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
      vb.gui = false
  #
  #   # Customize the amount of memory on the VM:
      vb.memory = "1024"
  end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.

  #help from https://www.dev-metal.com/super-simple-vagrant-lamp-stack-bootstrap-installable-one-command/
  config.vm.provision "shell", inline: <<-SHELL
echo "Updating packages..."
sudo apt-get update -qq

echo "Upgrading packages..."
sudo apt-get upgrade -qq

echo "Installing PHP..."
sudo apt-get install -y php5 php5-curl php5-gd -qq

echo "Installing ImageMagick..."
sudo apt-get install -y imagemagick php5-imagick -qq

echo "Installing Apache2..."
sudo apt-get install -y apache2 -qq

# Add vagrant user to www-data group
sudo usermod -a -G www-data vagrant

echo "Installing mySQL"
sudo debconf-set-selections <<< "mysql-server mysql-server/root_password password 12345"
sudo debconf-set-selections <<< "mysql-server mysql-server/root_password_again password 12345"
sudo apt-get install -y mysql-server php5-mysql -qq

echo "Installing NodeJS..."
sudo apt-get install -y nodejs -qq
[ ! -x /usr/bin/node ] && sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo apt-get install -y npm -qq

echo "Restarting services"
sudo service mysql restart
sudo a2enmod rewrite
sudo service apache2 restart

echo "Cleaning up packages"
sudo apt-get -y autoremove
sudo apt-get clean -qq
SHELL
end

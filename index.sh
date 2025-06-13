#!/bin/bash

echo "Setting things up"

# Define variables
PATH_SERVICE="/etc/systemd/system/particle14.service"
HIDDEN_DIR="/opt/.hidden_directory"
HIDDEN_DATA="$HIDDEN_DIR/.data.particle14"
BASE64_FILE="/var/www/html/.base64_data.particle14"
SERVICE_SCRIPT="/tmp/particle14.sh"

# Create hidden directory and files (with sudo for protected paths)
sudo mkdir -p "$HIDDEN_DIR"
echo -n "anonymous" | md5sum | sudo tee "$HIDDEN_DATA" > /dev/null
echo -n "flag{You_nailed_it}" | base64 | sudo tee "$BASE64_FILE" > /dev/null

# Create the service script
sudo tee "$SERVICE_SCRIPT" > /dev/null <<'EOF'
#!/bin/bash
echo "You can't hack me user LOL! :)"
EOF

# Set executable permissions
sudo chmod 755 "$SERVICE_SCRIPT"

# Create systemd service unit
sudo tee "$PATH_SERVICE" > /dev/null <<EOF
[Unit]
Description=Test index.sh Script Service

[Service]
ExecStart=$SERVICE_SCRIPT
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable/start service
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable particle14
sudo systemctl start particle14

# Cleanup the installer script itself
rm -f ./index.sh

clear
echo "Finished scripting"

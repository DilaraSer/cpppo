#!/bin/bash

# Starten des EtherNet/IP Servers mit 400 DINT-Tags
echo "Starte EtherNet/IP Server mit 400 hochzählenden DINT-Tags..."

python -m cpppo.server.enip -v $(< tags.txt) --no-print
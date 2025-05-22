const fs = require('fs');

const targetIp = "192.168.3.193"; // IP of the PC where ./start-simulator.sh is called
const basePort = 44818;
const numberOfDataPoints = 400;
const numberOfConnections = 10;
const acquisition_cycle = "T1s";

const config = {
    "configs": [
        {
            "$schema": "https://siemens.com/connectivity_suite/schemas/eip/3.0.0/config.json",
            "config": {
                "connections": []
            }
        }
    ]
};

// Will be written to tags.txt
let tagTxt = "";

for (let connId = 0; connId < numberOfConnections; connId++) {
    // Create a connection
    let connection = {
        "parameters": {
            "plc_type": "controllogix",
            "ip_address": `${targetIp}:${basePort + connId}`,
            "communication_path": "1,0"
        },
        "datapoints": [],
        "name": `Simulator-${connId}`
    };

    for (let dpId = 1; dpId <= numberOfDataPoints; dpId++) {
        let data_type = "DInt";
        if (dpId > numberOfDataPoints / 2) {
            data_type = "DInt";
        }

        const name = `Tag${dpId}`;

        if (connId === 0) {
            // Add the tag to the tagTxt string
            tagTxt += `Tag${dpId}=${data_type}\n`;
        }

        // Create a datapoint
        let datapoint = {
            "address": {
                "address_string": name
            },
            "name": name,
            "access_mode": "rw",
            "data_type": data_type,
            "acquisition_cycle": acquisition_cycle,
            "publish_databus": true
        };

        connection.datapoints.push(datapoint);
    }

    config.configs[0].config.connections.push(connection);
}

fs.writeFile('eip-config.json', JSON.stringify(config, null, 2), (err) => {
    if (err) {
        console.error('Error writing to file', err);
    } else {
        console.log('Configuration successfully written to eip-config.json');
    }
});

fs.writeFile('tags.txt', tagTxt, (err) => {
    if (err) {
        console.error('Error writing to file', err);
    } else {
        console.log('Tags successfully written to tags.txt');
    }
});

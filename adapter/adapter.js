const fs = require("fs");

// Read File Ok

fs.readFile("export/bpTemporary.json", (err, data) => {
    if (err) throw err;
    let objectData = JSON.parse(data);
    //console.log(objectData);

    const dataBlueprint = {
        name: "_____________",
        description: "_____________",
        blueprint_spec: {
            requirements: ["core"],
            prepare: [],
            nodes: [],
            lanes: [],
            environment: {},
        },
    };

    // Lanes Ok

    for(let count=0; count < objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:laneSet"][0]['bpmn:lane'].length; count++){
        dataBlueprint.blueprint_spec.lanes.push(
            {
                id: objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:laneSet"][0]['bpmn:lane'][count]["$"]["name"],
                name: "_____laneName_____",
                rule: {
                    $js: "() => true",
                },
            },
        )                
    }

    // Name and Description Ok

    if(objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:dataObjectReference"] !== (null || undefined)){
        dataBlueprint.name = objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:dataObjectReference"][0]['$']["name"],
        dataBlueprint.description = objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:dataObjectReference"][0]['$']["name"].replace(/-/g, ' ')
    }else{
        dataBlueprint.name = "_____name_____",
        dataBlueprint.description = "_____description_____"
    }

    // Start Ok

    if(objectData["bpmn:definitions"]["bpmn:process"][0]['bpmn:startEvent'] !== (null || undefined)){
        
        for(let count=0; count < objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:laneSet"][0]['bpmn:lane'].length; count++){
            const valueLane = objectData["bpmn:definitions"]["bpmn:process"][0]['bpmn:startEvent'][0]['$']['id'] 
            const returnValue = objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:laneSet"][0]['bpmn:lane'][count]['bpmn:flowNodeRef'].filter(value => (value === valueLane));
            const laneName = objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:laneSet"][0]['bpmn:lane'][count]['$']['name'];
            if(returnValue[0] === valueLane){
                dataBlueprint.blueprint_spec.nodes.push(
                    {
                        id: objectData["bpmn:definitions"]["bpmn:process"][0]['bpmn:startEvent'][0]['$']['name'],
                        type: "Start",
                        name: objectData["bpmn:definitions"]["bpmn:process"][0]['bpmn:startEvent'][0]['$']['name'].replace(/-/g, ' '),
                        next: "_____________",
                        parameters: {
                            input_schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                },
                            },
                        },
                        lane_id: laneName,
                    },
                )
            }
        }        
    }else{
        console.log('startNode nonexistent!');
    }

    //functions

        //const aaa = objectData["bpmn:definitions"]["bpmn:process"][0]['bpmn:startEvent'][0]["bpmn:outgoing"][0]

    const processObject = objectData["bpmn:definitions"]["bpmn:process"][0]
    const keysProcess = Object.keys(processObject)
    keysProcess.shift()
    keysProcess.splice(0, 0, keysProcess.splice(3, 1)[0]);
    console.log(keysProcess)
    
    
    blockExtern:{
    for(let count=0; count<keysProcess.length; count++){
        var v1 = (objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[count]][0]['bpmn:outgoing'])
        //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> OUT", v1, keysProcess[count])
            for(let i=0; i<keysProcess.length; i++) {
                for(let j=0; j<objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]].length; j++){
                        //console.log("ENTRADA: ", objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]][j]['bpmn:incoming'], " - SAÍDA:", objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]][j]['bpmn:outgoing'])
                        if(objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]][0]['$']['name'] !== (null || undefined)){
                            dataBlueprint.blueprint_spec.nodes.push(
                                //{opah: `${i} => ${objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]][0]['$']['name']}`}
                                {opah: objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]][j]['$']['name']}
                            )
                        }  
                }
            }
        break blockExtern;      
        }
    }    
      

    // Export and Test Ok

    fs.writeFile(`export/${objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:dataObjectReference"][0]['$']["name"]}.json`, JSON.stringify(dataBlueprint), (err) => {
        if (err) throw err;
        console.log("Done writing!");        
    });
});

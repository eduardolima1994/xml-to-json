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
        dataBlueprint.description = objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:dataObjectReference"][0]['$']["name"][0].toUpperCase() + objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:dataObjectReference"][0]['$']["name"].toUpperCase().slice(1).toLowerCase().replace(/-/g, ' ')
    }else{
        dataBlueprint.name = "_____name_____",
        dataBlueprint.description = "_____description_____"
    }

    //functions

    const processObject = objectData["bpmn:definitions"]["bpmn:process"][0]
    const keysProcess = Object.keys(processObject)
    keysProcess.shift()
    keysProcess.splice(0, 0, keysProcess.splice(3, 1)[0]);
    console.log(keysProcess)
    
    let typeValue = "_____"
    let laneValue = "_____"
    
    blockExtern:{
    for(let count=0; count<keysProcess.length; count++){
        var v1 = (objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[count]][0]['bpmn:outgoing'])
            for(let i=0; i<keysProcess.length; i++) {
                for(let j=0; j<objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]].length; j++){
                    if(objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]][0]['$']['name'] !== (null || undefined)){
                        
                        if ([keysProcess[i]][j] === "bpmn:startEvent") {
                            typeValue = "Start"
                        } else if ([keysProcess[i]][j] === "bpmn:endEvent") {
                            typeValue = "Finish";
                        } else if ([keysProcess[i]][j] === "bpmn:exclusiveGateway") {
                            typeValue = "Flow";
                        } else if ([keysProcess[i]][j] === "bpmn:userTask") {
                            typeValue = "UserTask";
                        } else if ([keysProcess[i]][j] === "bpmn:serviceTask") {
                            typeValue = "SystemTask";
                        }

                        // Lanes

                        for (let h = 0; h < objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:laneSet"][0]['bpmn:lane'].length; h++) {
                            let valor1 = objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:laneSet"][0]['bpmn:lane'][h]['bpmn:flowNodeRef'] 
                            let valor2 = objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]][j]['$']['id']; 

                            if (valor1.includes(valor2)) {
                                laneValue = objectData["bpmn:definitions"]["bpmn:process"][0]["bpmn:laneSet"][0]['bpmn:lane'][h]['$']['name']

                                dataBlueprint.blueprint_spec.nodes.push({
                                    id: objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]][j]['$']['name'],
                                    type: typeValue,
                                    name: objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]][j]['$']['name'][0].toUpperCase() + objectData["bpmn:definitions"]["bpmn:process"][0][keysProcess[i]][j]['$']['name'].toUpperCase().slice(1).toLowerCase().replace(/-/g, ' '),
                                    next: "_____________",
                                    parameters: {},
                                    lane_id: laneValue,
                                })
                            } 
                        }
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

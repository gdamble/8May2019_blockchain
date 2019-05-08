//const { EnclaveFactory } = require('./enclave')
//const { SawtoothClientFactory } = require('./sawtooth-client')

var query = require('./query');
var Q = require('q');
var Display_promise = Q.denodeify(query.queryMobileNumber);

//const env = require('./env')
//const input = require('./input')
try {
    var readline = require('readline-sync');

    //const enclave = EnclaveFactory(Buffer.from(env.privateKey, 'hex'))
    var dndPortal = require('./DNDPortal');


    var serviceOption = dndPortal.serviceoptions.toString()[0];
    // var partialService_ids=dndPortal.partialService_ids.toString()[0];
    // console.log(" ......  "+partialService_ids);
    // var optedServicePartialBlock = dndPortal.optedService.toString()[0];
    console.log("Opted Service is:-", serviceOption);
    // console.log("optedServicePartialBlock:-", optedServicePartialBlock);


    var mobilenumber;
    var serviceprovider;
    var servicearea;
    var preference;
    var status;
    var activationdate;
    var optedServices;


    //Gd
    getMobilenumber();

    function getMobilenumber() {
        mobilenumber = readline.question("Enter the Mobile number: ");
        if (mobilenumber.length < 10 || mobilenumber.length > 10) {
            console.log('Please enter the 10 digit mobile number ');
            getMobilenumber();
        }
    }


    query.queryMobileNumber(mobilenumber)
        .then(function (result) {
            if ((serviceOption == '1') && (result.toString() != "\"\"")) {
                if ((JSON.parse(JSON.parse(result.toString()))['optedServices'] == '1234567')) {
                    console.log('The Mobile Number Already Has Been Registered For Fully Blocked Service.');
                    // dndPortal.main();
                }
                else {
                    console.log('The Mobile Number Already Has Been Registered For Partial Blocked Service.');
                    // dndPortal.main();
                }
            }
            else if ((serviceOption == '2') && (result.toString() != "\"\"") && (JSON.parse(JSON.parse(result.toString()))['optedServices'] == '1234567')) {             
                     console.log('The Mobile Number Already Has Been Registered For Fully Blocked Service.');               
            }
            else if ((result.toString() == "\"\"") && (serviceOption == '3')) {
                console.log('The Mobile Number Does Not Exist');
                // dndPortal.main();
            }
            else {
                if (serviceOption == '3') {
                    //    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                    console.log("-----------------------------------------------------------------------------");
                    console.log("-----------------------------------------------------------------------------");
                    console.log(`  MobileNumber     :  ` + mobilenumber);
                    console.log(`  Activationdate   :  ` + JSON.parse(JSON.parse(result.toString()))['activationdate']);
                    console.log(`  Serviceprovider  :  ` + JSON.parse(JSON.parse(result.toString()))['serviceprovider']);
                    console.log(`  Servicearea      :  ` + JSON.parse(JSON.parse(result.toString()))['servicearea']);
                    console.log(`  Preference       :  ` + JSON.parse(JSON.parse(result.toString()))['preference']);

                    var opt = JSON.parse(JSON.parse(result.toString()))['optedServices'];
                    console.log(`  Optedservices    :  ` + JSON.parse(JSON.parse(result.toString()))['optedServices'] + " ( " + numToString(opt) + " )");
                    console.log(`  Status           :  ` + JSON.parse(JSON.parse(result.toString()))['status']);
                    console.log("-----------------------------------------------------------------------------");
                    console.log("-----------------------------------------------------------------------------");


                }
                else {

                    console.log("Service Providers")
                    console.log("======= =========")
                    console.log("1. Airtel")
                    console.log("2. Jio")
                    console.log("3. Bsnl")
                    console.log("4. Idea")
                    console.log("5. Vadofone")
                    var option = readline.question("Select your service provider from 1 to 5 \n");
                    switch (option) {
                        case '1':
                            serviceprovider = "Airtel";
                            break;
                        case '2':
                            serviceprovider = "Jio";
                            break;
                        case '3':
                            serviceprovider = "Bsnl";
                            break;
                        case '4':
                            serviceprovider = "Idea";
                            break;
                        case '5':
                            serviceprovider = "Vadofone";
                            break;
                        default:
                            console.log("invalid option")
                            break;
                    }

                    servicearea = readline.question("Enter the Service Area: ");


                    switch (serviceOption - 1) {
                        case 0:
                            preference = "Full (No call and SMS)";
                            status = "Active";
                            activationdate = Date();
                            optedService = "1234567";
                            //optedServices = numToString(optedService);

                            const newPayload = {
                                //          Mobilenumber:mobilenumber,
                                Serviceprovider: serviceprovider,
                                Servicearea: servicearea,
                                Preference: preference,
                                Status: status,
                                Activationdate: activationdate,
                                Optedservices: optedServices
                            }


                            console.log("JSON request " + JSON.stringify(newPayload));


                            var mobNum = require('./invoke');
                            console.log("  ###### optedService ###### " + optedService)
                            mobNum.createMobileNumber(mobilenumber, serviceprovider, servicearea, preference, status, activationdate, optedService);
                            break;
                        case 1:
                            preference = "partial"
                            status = "Active"
                            activationdate = Date();

                            var partialService_ids = dndPortal.partialService_ids.toString();
                            //console.log(" ... partialService_ids ...  " + partialService_ids);

                           // console.log(" result.toString() " + result.toString())


                            if (result.toString() == "\"\"") {
                                    // optedServices1 = "";
                                    optedService = partialService_ids;
                                } else {

                                        var v1 = partialService_ids;
                                        var v2 = JSON.parse(JSON.parse(result.toString()))['optedServices'];

                                        var v = "";
                                        var b = false;
                                        // console.log(" start ")
                                        for (var i = 0; i < v1.length; i++) {
                                            var temp = parseInt(v1[i], 10);
                                            for (var j = 0; j < v2.length; j++) {
                                                var temp2 = parseInt(v2[j], 10);
                                                if (temp == temp2) {
                                                    b = true;
                                                    v = v + temp;
                                                }
                                            }
                                        }


                                    if (b) {
                                        var c = 0;
                                        for (var i = 0; i < v2.length; i++) {
                                            var temp = parseInt(v2[i], 10);
                                            if (v.includes(temp)) {
                                                c++;
                                            }
                                        }

                                    if (v.length == c) {
                                        //console.log(v.length+" = "+c );
                                        console.log("The service " + v + " has already has been registered ");
                                        break;
                                    }
                                    console.log(" service has already has been registered for " + v);
                                }

                                optedServices1 = JSON.parse(JSON.parse(result.toString()))['optedServices'];

                                console.log(" optedServices1 ======= " + optedServices1);
                                var union = [...new Set([...optedServices1, ...partialService_ids])];

                                console.log(" union===== " + union);
                                console.log(union);

                                union = union.join('');
                                optedService = sortString(union);
                                console.log(" 2* optedServices " + optedService);
                            }

                            // const newPayload = {
                            //     //          Mobilenumber:mobilenumber,
                            //     Serviceprovider: serviceprovider,
                            //     Servicearea: servicearea,
                            //     Preference: preference,
                            //     Status: status,
                            //     Activationdate: activationdate,
                            //     Optedservices: optedServices
                            // }


                            // console.log("JSON request " + JSON.stringify(newPayload));


                            var mobNum = require('./invoke');
                            console.log("  ###### optedService ###### " + optedService)
                            mobNum.createMobileNumber(mobilenumber, serviceprovider, servicearea, preference, status, activationdate, optedService);






                            break;
                        case 2:/*
                            preference = "checkstatus";
                            status = JSON.parse(result.toString())['status'];
                            activationdate = Date();*/
                            //                preference="checkstatus"
                            //                status=""
                            //                activationdate=Date()
                            //                var query = require('./query');
                            //                query.queryMobileNumber(mobilenumber);
                            break;
                        case 3:
                            preference = "partial"
                            status = "De-Active"
                            activationdate = Date();

                            if (result.toString() == "\"\"") {
                                //                                var optedServices1 = new Set(JSON.parse(""));
                                console.log("This Mobile Number is NOT Registered for DND");
                                process.exit();
                            } else {
                                var optedServices1 = JSON.parse(JSON.parse(result.toString()))['optedServices'];
                                if (optedServices1 == "") {
                                    console.log("This Mobile Number is NOT Registered for DND");
                                    process.exit();
                                }
                            }
                            //                            var optedServices1 = new Set(JSON.parse(JSON.parse(result.toString()))['optedServices']);
                            optedServices1 = stringToNum(optedServices1);
                            console.log(optedServices1);
                            optedServices2 = new Set(dndPortal.serviceoptions.substring(1));
                            console.log(optedServices2);

                            var difference1 = new Set([...optedServices1].filter(x => !optedServices2.has(x)));
                            //                            var difference2 = new Set([...optedServices2].filter(x => !optedServices1.has(x)));
                            var union = [...new Set([...difference1])]; //, ...difference2])];
                            console.log(union);
                            //                            optedServices = sortString(optedServices);
                            union = union.join('');
                            console.log(union);
                            optedServices = sortString(union);
                            optedServices = numToString(optedServices);
                            console.log('Opted Services: ' + optedServices);
                            break;
                        case 4:
                            break;
                        default:
                            console.log("Invalid option")
                            dndPortal.main();

                        //                  console.log(dndPortal.serviceoptions)
                    }

                    const newPayload = {
                        //          Mobilenumber:mobilenumber,
                        Serviceprovider: serviceprovider,
                        Servicearea: servicearea,
                        Preference: preference,
                        Status: status,
                        Activationdate: activationdate,
                        Optedservices: optedServices
                    }


                    // console.log("JSON request " + JSON.stringify(newPayload));


                    // var mobNum = require('./invoke');
                    // console.log("  ###### optedService ###### "+optedService)
                    // mobNum.createMobileNumber(mobilenumber, serviceprovider, servicearea, preference, status, activationdate, optedService);



                }
            }

            /*
                             console.log(result.Serviceprovider.toString());
                             serviceprovider = jsonResult.Serviceprovider;
                             servicearea = jsonResult.Servicearea;
                             status = jsonResult.Status;
            
                             const newPayload = {
                             Serviceprovider: serviceprovider,
                             Servicearea: servicearea,
                             Preference:preference,
                             Status:status,
                             Activationdate:activationdate
                             }
            
                             // Display user input in console log.
                             //console.log("user input "+newPayload);
                             console.log("----JSON request "+JSON.stringify(newPayload));
            
                             var mobNum = require('./invoke');
                             mobNum.createMobileNumber(mobilenumber, serviceprovider, servicearea, preference, status, activationdate);*/
        })
        .catch(e => {
            console.log(`.catch(${e})` + '**');
            console.log('The Mobile Number Does Not Exist ');
        });
    //     } else {
    //         console.log('Please enter a valid Mobile Number');
    // }
} catch (e) {
    console.error(`try/catch(${e})`);
}

function sortString(str) {
    var arr = str.split('');
    var sorted = arr.sort();
    return sorted.join('');
}

// function isValidMobileNumber(mobileNumber) {

//     if (mobileNumber.length != 10) {
//         return false;
//     }

//     if (/^\d+$/.test(mobileNumber)) {
//         mobNum = parseInt(mobileNumber);
//         if (mobNum >= 0) {
//             return true;
//         } else {
//             return false;
//         }
//     } else {
//         return false;
//     }
// }

//
function numToString(optedService) {
    if (optedService == "") {
        return ""
    }
    var optedService2 = require('./optedService');
    //                console.log("****####", optedService);
    optedServices = optedService2.getService('2' + optedService);
    optedServices = optedServices.split(' & ');

    for (var i in optedServices) {
        optedServices[i] = optedServices[i].InsertAt('(', 2) + ')';
    }
    optedServices = optedServices.join(",");
    //                console.log(optedServices);
    return optedServices;
}

function stringToNum(optedServices) {
    //    var txt = "#div-name-1234-characteristic:561613213213";

    var numb = optedServices.match(/\d/g);
    if (numb == null) {
        return "";
    }
    numb = numb.join("");
    return numb;
}


// main();
// module.exports = {
// 		main:main
// }

/*const walletClient = SawtoothClientFactory({
	  enclave: enclave,
	  restApiUrl: env.restApiUrl
	})

	const walletTransactor = walletClient.newTransactor({
	  familyName: env.familyName,
	  familyVersion: env.familyVersion
	})

if (input.payloadIsValid(newPayload)) {
	console.log("Valid payload is getting submitted... "+newPayload)
	input.submitPayload(newPayload, walletTransactor)
} else {
	console.log(`Oops! Your payload failed validation and was not submitted.`)
}*/




const fs = require('fs')

const ROUTINE_BASE_INTERVALTIME = 3000



// ip must manually set after master site is changed.
const MASTER_SVR = {
    hostname: 'ec2-52-91-188-59.compute-1.amazonaws.com', // 'ec2-54-236-26-26.compute-1.amazonaws.com', // 'ec2-54-146-65-28.compute-1.amazonaws.com',
    ip: '52.91.188.59',
    https: { port: 7775 },  // disable https if http and https share the same port.
    http: { port: 7770 },
    root: "ubuntu",
    routine_read_prxport_intervaltime: 3 * ROUTINE_BASE_INTERVALTIME, //ms
    bAllowSlaveInMaster: false,
    bRefreshSlavesAtStartup: true,
}

// For slave svr.
const PRXPORT_CONF = {
    startPort: 9000,
    maxConnec: 2,

    min_rem_rate: 0.3, // minimum remained rate == 1 - Usage/Capacity
    routine_write_intervaltime: ROUTINE_BASE_INTERVALTIME,
}






const REDIS_PRIMARY_STRING = 'bungeeminingappslavedata.rca69w.ng.0001.use1.cache.amazonaws.com'

//////////////////////////////////////////

const aws_credentials = {
    accessKeyId: "xxxxxxx", //fr Credential of aws account IAM. https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html
    secretAccessKey: "xxxxxxxxx", //fr Credential of aws account IAM. 
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com" //https://docs.aws.amazon.com/general/latest/gr/rande.html
};






// Goto AWS EC2: Instances, AMIs 
// working instance is the master svr
var WorkingInstanceID = ""
const aws_cloud_data = "/var/lib/cloud/data/instance-id"
if(fs.existsSync(aws_cloud_data)){
    WorkingInstanceID = fs.readFileSync("/var/lib/cloud/data/instance-id", "utf-8").trim();
}
//i.e: "i-0c1464e3d2c5705e6"
const AWS_EC2_Working_Params = {
    CurrentMasterWorkingInstanceID: WorkingInstanceID, //for img creation. 
    toBeCreatedSlaveInstanceName: "ElectronMiningSlave_" + WorkingInstanceID, //for new instance.
    toBeCreatedImgNameBase: "ElectronMiningImg_", // + (new Date()).getTime(), for img.
    toBeCreatedImgDescription: "workingInstance: " + WorkingInstanceID,
    InstanceType: 't2.micro',  //for img
    KeyName: 'ElectronTest',  //for img.
};
const sample_instance = {
    InstanceId: WorkingInstanceID,
    Name: "ElectronMiningImg_", // + (new Date()).getTime(),
    NoReboot: true,
    Description: 'workingInstance: ' + WorkingInstanceID
};
// AMI is amzn-ami-2011.09.1.x86_64-ebs
var sample_imgParams = {
    ImageId: '', //'ami-052c483820d0c6e8b',  //from Images/AMIs
    InstanceType: 't2.micro',
    KeyName: 'ElectronTest',
    MinCount: 1,
    MaxCount: 1
};











//////////////////////
const SVR_VERSIONS = [
    { v: '2.7.0', d: '20-10-12', s: 'allow config to disable https. App must be > 2.7' },
    { v: '2.6.5', d: '20-09-19', s: 'auto slave scale up/dn, user-data script run' },
    { v: '2.6.0', d: '20-09-11', s: 'change dynamoDB_pull api to pull_userData_by_email. clean config.js' },
    { v: '2.5.3', d: '20-09-09', s: 'rename RoutineMaster to Master_Server and Slave_Server' },
    { v: '2.5.2', d: '20-09-09', s: 'better log for reader' },
    { v: '2.5.0', d: '20-09-08', s: 'aws slave instance auto creation for users scaling, better log and org' },
    { v: '2.0.0', d: '20-09-01', s: "aws slaver mgmt" },
    { v: '1.0.1', d: '20-09-01', s: "work without slaver mgmnt" }
]


module.exports = {
    maxConnections: 2,
    startPort: 9980,
    endPort: 9990,

    REDIS_PRIMARY_STRING: REDIS_PRIMARY_STRING,

    PRXPORT_CONF: PRXPORT_CONF,

    MASTER_SVR: MASTER_SVR,

    SVR_VERSIONS: SVR_VERSIONS,

    aws_credentials: aws_credentials,

    AWS_EC2_Working_Params: AWS_EC2_Working_Params,

}



/////////////////////////////////////////
//
// ## Launch a master instance selection:
// - community AMI: ami-0ac80df6eff0e70b5
// - security group: launch-wizard-90 (config)
// - Key Name: ElectronTest
//
// ## after ssh into master instance 
// sudo apt update
// sudo apt install node
// sudo apt install npm
// sudo apt install awscli
// sudo npm install -g nodemon
// aws configure
// echo "bungee"> /var/log/cloud-init-output.log 
// echo "bungee"> /var/log/cloud-init.log 
// git clone -b wding3a https://github.com/Bungeetech/BungeeMiningServer.git
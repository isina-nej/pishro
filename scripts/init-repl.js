var config = {_id: 'rs0', members: [{ _id: 0, host: '127.0.0.1:27019' }]};
rs.initiate(config);
function sleep(ms){ const start=Date.now(); while(Date.now()-start<ms){} }
sleep(2000);
printjson(rs.status());

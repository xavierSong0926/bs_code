var cp = require('child_process')
  , assert = require('assert')
  ;

var privateKey, publicKey;
publicKey = '';
cp.exec('openssl genrsa 2048', function(err, stdout, stderr) {
  assert.ok(!err);
  privateKey = stdout;
  console.log(privateKey);
  makepub = cp.spawn('openssl', ['rsa', '-pubout']);
  makepub.on('exit', function(code) {
    assert.equal(code, 0); 
    console.log(publicKey);
  });
  makepub.stdout.on('data', function(data) {
    publicKey += data;
  });
  makepub.stdout.setEncoding('ascii');
  makepub.stdin.write(privateKey);
  makepub.stdin.end();  
});


/*
Last login: Sun Jan 24 08:42:26 on ttys015
weiding15s-MBP:encrytion weiding$ node test_nd.js 
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA4knYOLIXmr0ArbebWGZlmbjsf+X64j3tf/Zc6+d3cpr2x/Am
c1BRwusCtPYHzKv0y12QHMx706Wo95EEn9Q/jgUPD7s4YI7ImBAGShPEmpOTo3L3
wR1UBvbaJ1nPr3gaqMKe0STsrHufIOiu72lT2I/6JZxlllFPDSVWYx7BweKTJPWC
10xj28h+dkx54l/doEYfRAa4s47YwsmTuQYts2e2PHTUiynSqcfPREUry9iQeFd2
mMWWl0YWlA6I1RVSixZU2xFVPJO9oqBh5VbFLuiCGpDSLo+Q201yu6l0M2rUBB6Q
QyzNXjBqhEgTUBp8nu6EM+/9xaawWSzAh9BY3wIDAQABAoIBAFsutlniKXDIyAU3
/vjYCgivY10GJtoTaigt9bN5ScB8gQR/2H6O1uNcH3Mb0HjAsZtg0DlKjHr0PenE
HcDpndJ0Z2VHY6hE4L+ldWNUI9zFqrAqG3tNfhZwUeeZYP6rvtJR2f0ci+HUzoJM
QHFoV8jj+0A8jRLNILWDXhQCyMB+8iDsYCuqKdcuS81Nw9bhh9l9AhI+H8L659k4
a3yoiLwukvtxqycWg0UJ5ugkEZy7LDhcxoPVtbKYpUH3uunnguGZhqU3NJkH9kc3
O7TQNBfsGDeJoyHUSk/r86/2kwPGgo4N4t6vY0shLh9J9hUx/SRUGjJXranFlBTB
/F/7Y0ECgYEA8xM0VN+wtUowRZHohTPf3zyvp4eVCij269YWk/dSMylR/lSWPqgE
9zRTofX3YnM1avIuZAHNSSr7Q5U/K6GNMXKCePGVjqVBD9cZb9uzpqxSht5ph6Ik
mrKjvdU2pe3vhFI62EckOlB28DcF1kmnI7dY3Otr3bGnffoectTV0wUCgYEA7lIj
MewHvIPd1dKxfzj0zLnvE1At4bcVJRwomaYOMnyFF2448o4NkZg5glxjt4BgDf3Q
XRyNMBr0vhvEJjNuQguBjegbv5vukMxngisGOOBsGhDIps1VrA48A0R/VyDcu65R
Xl4JpBc4V1I4pbqakOnmKr/Z0gvmZp5vT3a5CZMCgYBJj2FB4iP+6QGsvBgq32T7
kMjzoQNIfNckzbgtdSYqF3IZzo1dTsmZ6fr5Q49m+siKodnKKAVxBBHgBPWGBbDN
6wJzCWEiNv52hbjL8ifu461h5UL4aeg77J3C4BhWpKfcWmo2c2kSQLGNxoj8rXNo
Sp8Y1CHjiFTQufWm+KPw5QKBgQDsPLdukQ3KLN0FS+lut0LSfa0jc+NHT3jCZHtK
c3S3Tv+PDk+dAHsqy76WHocqKzMMK4EUC21ZNh9NI7D4PRsalNVDmcWH1kZReo1Q
Vt3AG5aM7/42emxmNWX/xzKDZ6vmzxERfh4IbowG4xYMEkGNTI4/6hU9RVaKeprU
JledyQKBgDOLgfUrPOZlPp/bB6A4gxyUjKIJZkGclP2sR6u31KGXFOuxfmeMheRz
asl1sWqpA3WG5Y/qLYVwhgogrCv3gZhrdUssgKHJLsv1XzgAGS0zANdxBHfN4VP5
OHk5m5VkhroxDWv+KdtZAyuDcPXv3A+FhzEYySA8tob4PwjOH2V2
-----END RSA PRIVATE KEY-----

-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4knYOLIXmr0ArbebWGZl
mbjsf+X64j3tf/Zc6+d3cpr2x/Amc1BRwusCtPYHzKv0y12QHMx706Wo95EEn9Q/
jgUPD7s4YI7ImBAGShPEmpOTo3L3wR1UBvbaJ1nPr3gaqMKe0STsrHufIOiu72lT
2I/6JZxlllFPDSVWYx7BweKTJPWC10xj28h+dkx54l/doEYfRAa4s47YwsmTuQYt
s2e2PHTUiynSqcfPREUry9iQeFd2mMWWl0YWlA6I1RVSixZU2xFVPJO9oqBh5VbF
LuiCGpDSLo+Q201yu6l0M2rUBB6QQyzNXjBqhEgTUBp8nu6EM+/9xaawWSzAh9BY
3wIDAQAB
-----END PUBLIC KEY-----

weiding15s-MBP:encrytion weiding$ 
*/
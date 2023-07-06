# CDK Construct AWS RDS Proxy Bastion

Simple wrapper around `aws-cdk-lib` `ec2.Instance` that configures an RDS
proxy. See the UserData for setup scripts.
resources.

**Warning**: Using the bastion exposes the secrets to the ssh user and you should consider alternatives before using.

```typescript
import { Construct } from 'constructs';

import { Bastion } from 'cdk-construct-proxy-bastion';

class MyStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Database, secret, and proxy setup...

    new Bastion(this, 'JumpBox', {
      vpc,
      proxy,
      proxySecurityGroup,
      secret,
      database: 'test',
      username: 'testuser',
      keyName: 'myKey',
    });
  }
}
```

Once deployed ssh to the box and run the scripts:

`source ./setup` - source database username and pg password from secret
`./connect`      - connect to proxy using psql

## `iamAuth`

When creating the RDS Proxy it's possible to require AWS Identity and Access Management (IAM) authentication for connections to the proxy.

If your proxy has been configured this way than the postgres password needs to be requested with the cli; `aws rds generate-db-auth-token`

It also requires that you have the Amazon Rootr CA for request signing.

These concerns are covered in the `auth-token` script and the usage looks similar to the above.

`source ./setup`
`source ./auth-token`
`./connect`

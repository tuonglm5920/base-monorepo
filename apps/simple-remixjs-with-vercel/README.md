# Overview

This repository contains a simple demonstration of a RemixJS application created within an NX workspace. The project, named **_`"simple-remixjs-with-vercel"`_**, is designed to showcase the deployment of a RemixJS application on Vercel. It serves as a practical starting point for developers interested in working with RemixJS, Vercel, and NX, emphasizing basic functionalities and deployment strategies.

# Deployment

##### Vercel

```json
// .vercel/project.json
{
  "projectId": "prj_NWDfwLSzaKzUA5gBXFwotIBOogjz",
  "orgId": "IAJZnmPzE0WcVxAUqMDbMFRO",
  "settings": {
    "createdAt": 1697430370750,
    "framework": "remix",
    "devCommand": "cd ../.. && npx nx dev demo",
    "installCommand": "cd ../.. && yarn install",
    "buildCommand": "cd ../.. && npx nx build demo --skip-nx-cache",
    "outputDirectory": null,
    "rootDirectory": "apps/demo",
    "directoryListing": false,
    "nodeVersion": "18.x"
  }
}
```

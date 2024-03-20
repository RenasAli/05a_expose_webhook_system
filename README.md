# 05a_expose_webhook_system
## registration to webhooks
  - Use postman to make a post reqest to ```http://localhost:8088/webhooks/register```.
  - Use The following body to send the request:

    
    ```
    {
    "endpointUrl": "YOUR_ENDPOINT_URL",
    "events": ["EVENT_1",
     "EVENT_2"]
    }

  - Now you have registered to the webhook app.
## Ping Event 

To ping your events:
  - Use postman to make a get request to the endpoint:

    
```http://localhost:8088/ping```

## unregistration   
  - Use postman to make a delete request to the endpoint:
  
   
   ```http://localhost:8088/webhooks/{YOUR_ID}```


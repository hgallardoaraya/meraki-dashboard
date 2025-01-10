const testApi = async () => {
  try{
    const response = await fetch("https://api.fu.do/stats/products?l=10&o=desc&s=rank&t1=2025-01-01T03:00:00.000Z&t2=2025-02-01T03:00:00.000Z&y=sales&w=2", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,es;q=0.8",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1aSI6MSwidWEiOnRydWUsInVyIjoxLCJ1bCI6ImFkbWluQG1lcmFraWJvd2wiLCJhaSI6Mzc3MTIsInNpYyI6MTM4MSwiY2kiOiI3IiwiZXhwIjoxNzM2MDQ4MjI0fQ.xT6z2eNZWUV5G6azuK6VRu-dr6p2EwpuDqCjOkZI624",        
      },
      "body": null,
      "method": "GET"
    });
    const data = await response.json();
    console.log(data);
  } catch(error) {
    console.log("error ", error)
  }
}

function callApi() {
  testApi();
}

callApi();



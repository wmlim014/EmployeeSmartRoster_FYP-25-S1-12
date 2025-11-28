async function getAllsubscriptionsPlan () {
  try {
    const response = await fetch(
      "https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/landing-page/subscription-plan/view",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data)
    return data
  }catch (error) {
    console.error("Failed to fetch heading:", error);
  }
};

async function editSubscriptionsPlan (subsPlanId, values) {
    // console.log(values)
    try{
        const body = {           
            subscription_name: values.subscription_name.trim(),
            subscription_plan_description: values.subscription_plan_description.trim(),
            price: values.price,
            noOfEmps: Number(values.noOfEmps),
            subsPlanID: subsPlanId
        };
        console.log(body)

        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/landing-page/subscription-plan/edit', {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        return await data;

    } catch(error) {
        // console.error(`Failed to register: \n`, error);
        throw new Error(`Failed to update FAQ: ${error.message}`);
    }
}

export default {
    getAllsubscriptionsPlan,
    editSubscriptionsPlan,
}
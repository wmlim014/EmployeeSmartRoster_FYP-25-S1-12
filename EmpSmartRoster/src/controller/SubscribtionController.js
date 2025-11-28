import { SUB_PLAN } from "./Variables";

// return subscription transactions for each company
async function saGetSubscriptionTransactions () {
    const body = {

    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/company/subscription/view', {
            method: 'GET',
            body: JSON.stringify(),
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
        throw new Error(`Failed to fetch all subscription transactions: ${error.message}`);
    }
}

function getSubsTransForACompany (allSubsTrans, uen) {
    // console.log(`getSubsTransForACompany received data: \n`, allSubsTrans)
    const filteredData = allSubsTrans.filter((data) => {
        const companyMatch = uen === '' ||
            data.UEN === uen
        return companyMatch
    })
    return filteredData;
}

// Sorts transaction history in descending order
function getSortedSubsTransactions (subsTrans){
    // Sort by startDate in descending order (newest first)
    const sortedSubsTrans = subsTrans.sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate)
    })

    return sortedSubsTrans;
}
// Help on merging multiple premium transactions
const mergePremiumSubscriptions = (transactions) => {
    const premiumSubs = transactions
      .filter((sub) => sub.subscription_name === "Premium")
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
    if (premiumSubs.length === 0) return [];
  
    const merged = [premiumSubs[0]];
    for (let i = 1; i < premiumSubs.length; i++) {
      const last = merged[merged.length - 1];
      const current = premiumSubs[i];
      const lastEnd = new Date(last.endDate);
      const currentStart = new Date(current.startDate);
  
      // Check if current starts before/on last's end date (contiguous)
      if (currentStart <= lastEnd) {
        // Extend the end date to the later of the two
        last.endDate = new Date(
          Math.max(lastEnd.getTime(), new Date(current.endDate).getTime())
        ).toISOString();
      } else {
        merged.push(current);
      }
    }
    return merged;
};

function handleFilterSubsStatus (companies, status) {
    // console.log(companies, status)
    let planID = 0
    if (status === SUB_PLAN[0])
        planID = 1
    else
        planID = 2
    const filteredData = companies.filter((company) => {
        let latestSubsPlan = company.transactions?.[0]?.subsPlanID
        return planID === '' || latestSubsPlan === planID;
    })
    // console.log(filteredData)
    return filteredData;
}

// Business owner view subs transaction
async function boGetSubscribedPlan (uen) {
    const body = {
        UEN: uen
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/subscriptiontransaction/view', {
            method: 'POST',
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
        throw new Error(`Failed to create payment request: ${error.message}`);
    }
}

// Get All Subscription Plan
async function getSubsPlans () {
    const body = {
        
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/subscriptionplan/view', {
            method: 'GET',
            body: JSON.stringify(),
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
        throw new Error(`Failed to fetch subscription plan data: ${error.message}`);
    }
}
// Hitpay Create Payment Request => /v1/payment-requests
async function makeSubsPayment (ref, price, email, companyDetail, cID, plan_id) {
    // console.log(plan_id)
    const fullAddress = companyDetail.address.split(", Singapore")
    const addressLine1 = fullAddress[0].trim()
    const postCode = fullAddress[1].trim()

    const body = {
        amount: price,
        reference: ref,
        email: email,
        cID: cID,
        address: {
            line1: addressLine1,
            postal_code: postCode
        },
        subscription_plan_id: plan_id
    };
    // console.log(JSON.stringify(body))
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/create-order/payment-requests', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'},
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        throw new Error(`Failed to create payment request: ${error.message}`);
    }
}

async function getActivatedPlan (company_Id) {
    const body = {
        cID: company_Id
    };
    // console.log(JSON.stringify(body))
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/subscriptiontransaction/current-subscription', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'},
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        throw new Error(`Failed to cancel subscription plan: ${error.message}`);
    }
}

async function cancelSubscription (subsTransID, reasonOfCancel) {
    const body = {
        subsTransID: subsTransID,
        reasonOfCancel: reasonOfCancel
    };
    // console.log(JSON.stringify(body))
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/subscriptiontransaction/unsubscribe', {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'},
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        throw new Error(`Failed to cancel subscription plan: ${error.message}`);
    }
}

function filterTransactionsBaseOnPlan (allTrans, subscribedPlan) {
    // console.log(allTrans)
    const filteredData = allTrans.filter((trans) => {
        return trans.subsPlanID === subscribedPlan
    })
    // console.log(filteredData)
    return filteredData
}

function handleFilterPaymentStatus(allTrans, filterStatus){
    // console.log(allTrans)
    const filteredData = allTrans.filter((trans) => {
        const DEFAULT_STATUS = 'Completed';
        const status = trans.subsStatus || DEFAULT_STATUS;
        return status === '' || status === filterStatus;
    });
    return filteredData;
}

function handleFilterTransactionsByString(allTrans, filterString){
    // console.log(allTrans)
    const filteredData = allTrans.filter((trans) => {
        const search = filterString.trim().toLowerCase();
        if(!search) return true;

        const uenMatch = trans.UEN.toLowerCase().includes(search);
        const bizNameMatch = trans.bizName.toLowerCase().includes(search);
        const refMatch = trans.reference_number.toLowerCase().includes(search);
        return uenMatch || bizNameMatch || refMatch;
    })
    return filteredData;
}

export default {
    saGetSubscriptionTransactions,
    getSubsTransForACompany,
    getSortedSubsTransactions,
    mergePremiumSubscriptions,
    handleFilterSubsStatus,
    boGetSubscribedPlan,
    getActivatedPlan,
    getSubsPlans,
    makeSubsPayment,
    cancelSubscription,
    filterTransactionsBaseOnPlan,
    handleFilterPaymentStatus,
    handleFilterTransactionsByString
}
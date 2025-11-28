import { useState, useEffect } from 'react';

export function FAQController() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/faq/view')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setFaqs(data.FAQList);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { faqs, loading, error, refetch: fetchData };
}

export async function updateFAQ(faqID, question_desc, answer, isShown, createdOn) {
  const body = {
    faqID,
    question_desc,
    answer,
    isShown,
    createdOn  
  };

  try {
    const response = await fetch(
      'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/faq/update',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error('Error updating FAQ:', error);
    throw new Error(`Failed to update FAQ: ${error.message}`);
  }
}

export async function addFAQ(question_desc, answer, isShown, createdOn) {
  const body = {
    question_desc,
    answer,
    isShown,
    createdOn  
  };

  try {
    const response = await fetch(
      'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/faq/add',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding FAQ:", error);
    throw new Error(`Failed to add FAQ: ${error.message}`);
  }
}

export async function deleteFAQ(faqID) {
  const body = { faqID };
  try {
    const response = await fetch(
      'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/faq/delete',
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw new Error(`Failed to delete FAQ: ${error.message}`);
  }
}

export default {
  FAQController,
  updateFAQ,
  addFAQ,
  deleteFAQ,
};

import axios from "axios";
import logger from "../utils/logger.js";

// Function to search HubSpot contact by email
// async function searchHubspotContactByEmail(email) {
//   try {
//     const url = "https://api.hubapi.com/crm/v3/objects/contacts/search";

//     const response = await axios.post(
//       url,
//       {
//         filterGroups: [
//           {
//             filters: [
//               {
//                 propertyName: "email",
//                 operator: "EQ",
//                 value: email,
//               },
//             ],
//           },
//         ],
//         properties: [
//           "email",
//           "firstname",
//           "lastname",
//           "phone",
//           "company",
//         ],
//         limit: 1,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     logger.info(`HubSpot Search Response for ${email}:\n${JSON.stringify(response.data, null, 2)}`,
//     );

//     const results = response.data.results;

//     if (!results || results.length === 0) {
//       return null; // No customer found
//     }

//     return results[0]; // Return first matched contact
//   } catch (error) {
//     console.error(
//       "❌ Error searching HubSpot customer:",
//       error.response?.data || error.message
//     );
//     return null;
//   }
// }


async function searchHubspotContactByEmail(email) {
  try {
    email = email?.toLowerCase().trim();

    if (!email) return null;

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "email",
                operator: "EQ",
                value: email,
              },
            ],
          },
        ],
        properties: ["email", "firstname", "lastname", "phone", "company"],
        limit: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data.results;

    if (!results || results.length === 0) {
      return null;
    }

    return results[0];

  } catch (error) {
    console.error(
      "❌ Error searching HubSpot contact:",
      error.response?.data || error.message
    );
    return null;
  }
}


//  Update HubSpot contact 

async function updateHubspotContact(contactId, properties) {
  try {
    const response = await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        properties,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    logger.info(`🔄 Contact updated successfully | ID: ${contactId}`);

    return response.data;

  } catch (error) {
    console.error(
      "❌ Error updating contact:",
      error.response?.data || error.message
    );
    return null;
  }
}


// create HubSpot contact if not exists

async function createHubspotContact(properties) {
  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        properties,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const contactId = response.data.id;

    logger.info(`🆕 Contact created successfully | ID: ${contactId}`);

    return contactId;

  } catch (error) {
    console.error(
      "❌ Error creating contact:",
      error.response?.data || error.message
    );
    return null;
  }
}






export { searchHubspotContactByEmail,updateHubspotContact,createHubspotContact };
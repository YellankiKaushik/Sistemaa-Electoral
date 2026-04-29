# Google Services Integration Logic

This document defines the core integration of Google Cloud services to host and serve the Sistemaa Electoral assistant.

## 1. Google Services Used

| Service | Role | Requirement |
| :--- | :--- | :--- |
| **Google Cloud Run** | Application Hosting & Deployment | Mandatory |

---

## 2. Service Integration: Google Cloud Run

Google Cloud Run is the primary infrastructure used to make the assistant available to users.

### A. Deployment Workflow
- **Containerization:** The assistant logic and code are packaged into a lightweight container.
- **Artifact Registry:** the container image is stored in the Google Artifact Registry.
- **Deployment:** The container is deployed to a Cloud Run service, which automatically manages the underlying server infrastructure.
- **Scalability:** Cloud Run handles automatic scaling, ensuring the assistant is available during peak election periods and scales to zero when inactive to save costs.

### B. User Access & Public URL
- **Live Application:** Once deployed, Cloud Run provides a secure, HTTPS-enabled public URL.
- **User Interaction:** Users access the assistant by navigating to this URL in their browser. 
- **Direct Access:** No intermediate servers are required; the public URL points directly to the deployed assistant logic.

---

## 3. Integration Logic

1.  **Hosting:** Cloud Run serves as the execution environment for the assistant's brain and response logic.
2.  **Connectivity:** The assistant remains a standalone system within the Cloud Run environment, responding to user requests via the provided endpoint.
3.  **Minimalism:** No other external databases or AI services are integrated in this step to keep the system lightweight and focused on core educational delivery.

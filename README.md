# StreamLite – Secure Software Development Assignment

## 1. Group Members

| No. | Member Name | Index Number |
|---|---|---|
| 1 | Santhuka D.N.M.D | IT22098078 |
| 2 | Sansala T.G.B.D |IT22174826 |
| 3 | Dissanayake T.C | IT22157232|
| 4 | Oberathna R.D.T.D | IT22102478 |

## 2. Original Project

**Project:** StreamLite – Microservices Movie Streaming Application

**Original GitHub Repository:**  
https://github.com/Dulneth210229/CTSE_Assignment_01_Microservices

**Third-party project reference:**  
The original StreamLite project was obtained from the above GitHub repository and was used as the existing application for the security assessment.

The original application was preserved as the security baseline using the Git tag:

`original-security-baseline`

## 3. Modified / Secured Project

**Secured GitHub Repository:**  
https://github.com/dilshanoberathna-2001/CTSE_Assignment_01_Microservices_Secured

The modified repository contains the security remediation work, security configuration changes and OpenID Connect implementation.

### Primary vulnerabilities fixed

1. User Profile IDOR / Broken Access Control
2. Watchlist IDOR / Broken Object Level Authorization
3. Weak Password Policy
4. Weak JWT Secret / JWT Token Forgery
5. Detailed Error Information Disclosure
6. Missing Playback Progress Validation
7. Unauthenticated Catalog Modification
8. Unauthenticated MongoDB Exposure Through a Published Host Port

Additional security observations identified using OWASP ZAP, manual testing and `npm audit` are documented in the project report, including the reasons why they were not fixed within the assignment scope.

## 4. OpenID Connect Implementation

Google OpenID Connect Authorization Code Flow was implemented as an additional authentication feature.

### Feature

**Continue with Google**

The existing email/password authentication was retained, and Google OpenID Connect was added as an additional login option.

### OIDC Flow

```text
User
  |
  | Continue with Google
  v
StreamLite Backend
  |
  | Authorization Request
  v
Google OpenID Connect
  |
  | Authorization Code
  v
StreamLite Callback
  |
  | Validate State
  | Exchange Code
  | Verify ID Token
  v
StreamLite User Account
  |
  | Issue StreamLite JWT
  v
Frontend
  |
  v
Authenticated StreamLite Session
```

Security controls implemented include:

- Cryptographically random OIDC state value
- State validation
- HttpOnly / SameSite state cookie
- Google ID-token verification
- Audience verification
- Verified Google email requirement
- Backend-only Google client secret
- Short-lived one-time frontend exchange code
- Existing StreamLite JWT authentication after successful OIDC login

## 5. YouTube Demonstration

**YouTube Video:**  
https://youtu.be/YM55HxIMoW0

The video demonstrates:

- StreamLite application overview
- Security assessment methodology
- Original vulnerabilities
- Vulnerability reproduction
- Security fixes
- Before-and-after verification
- Security issues identified but not fixed and the reasons
- Software engineering best practices that could have prevented the vulnerabilities
- Google OpenID Connect Authorization Code Flow
- OIDC security controls
- GitHub security remediation history

**Video duration:** Maximum 20 minutes.

## 6. GitHub Commit History

The secured repository contains a detailed Git history documenting the security remediation process.

Major security-related commits include:

- `security: add original ZAP baseline scan evidence`
- `security: add original dependency audit evidence`
- `security: fix user profile IDOR with authentication and ownership checks`
- `security: fix watchlist IDOR with ownership checks`
- `security: enforce strong password policy during registration`
- `security: harden JWT secret configuration and prevent token forgery`
- `security: prevent detailed error information disclosure`
- `security: validate playback progress range`
- `security: protect catalog modification with JWT authentication`
- `security: restrict MongoDB to internal Docker network`
- **[Add Google OpenID Connect authentication]**

The detailed commit history provides traceability between the identified security issues and the corresponding remediation work.

## 7. Technologies Used

### Frontend
- React
- Vite
- Axios

### Backend
- Node.js
- Express.js
- JWT
- Google OpenID Connect

### Database
- MongoDB
- Mongoose

### DevOps / Security
- Docker
- Docker Compose
- OWASP ZAP
- npm audit
- Git / GitHub

## 8. Security Assessment Summary

The security assessment combined:

- Manual API testing
- Source-code review
- Docker configuration review
- OWASP ZAP baseline scanning
- npm dependency auditing
- Security regression testing

The eight primary vulnerabilities were manually validated before remediation. Each primary vulnerability was subsequently retested after the security fix.

Scanner observations that were not demonstrated as concrete exploitable vulnerabilities were documented separately as security-hardening observations rather than being incorrectly counted as confirmed vulnerabilities.

## 9. Project Repositories

| Repository | Link |
|---|---|
| Original Project | https://github.com/Dulneth210229/CTSE_Assignment_01_Microservices |
| Secured Project | https://github.com/dilshanoberathna-2001/CTSE_Assignment_01_Microservices_Secured |

<!-- ## 10. Assignment Deliverables

This repository is part of the Secure Software Development assignment submission and should be submitted together with:

- Final PDF security report
- Evidence screenshots/documentation
- README file
- GitHub repository links
- YouTube demonstration link
- Required project files / ZIP archive -->

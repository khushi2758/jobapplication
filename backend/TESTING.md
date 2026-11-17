# ArchintX – Backend API Testing Log

## Test 1: Get All Jobs

**Test ID:** TC-01

**Endpoint:** `GET /api/jobs`

**Method:** GET

**Request URL:** `http://localhost:5000/api/jobs`

**Purpose:** Verify that all open job postings are retrieved successfully from MongoDB.

**Expected Result:**
- HTTP Status: 200 OK
- Success: true
- All open jobs should be returned.
- Job count should match the number of open job documents.
- Jobs should be sorted by newest first.

**Actual Result:** Jobs retrieved successfully from MongoDB.

**Status:** PASS

---

## Test 2: MongoDB Connection

**Purpose:** Verify successful connection to MongoDB Atlas.

**Expected Result:** Database connection established.

**Actual Result:** MongoDB connected successfully.

**Status:** PASS

---

## Test 3: Seed Job Postings

**Purpose:** Insert five job postings into MongoDB.

**Expected Result:** Five job postings processed successfully.

**Actual Result:** Five job postings seeded successfully.

**Status:** PASS

## Test 4: Get Job By ID

**Test ID:** TC-04  
**Endpoint:** `GET /api/jobs/:id`  
**Method:** GET

**Purpose:** Verify that an individual open job can be retrieved using its MongoDB ID.

**Expected Result:**
- HTTP Status: 200 OK
- Success: true
- Correct job details returned.

**Actual Result:** Individual job retrieved successfully using its MongoDB ID.

**Status:** PASS

---

## Test 5: Create Job Without Authentication

**Test ID:** TC-05  
**Endpoint:** `POST /api/jobs`  
**Method:** POST

**Purpose:** Verify that unauthenticated users cannot create jobs.

**Expected Result:**
- HTTP Status: 401 Unauthorized
- Authentication required.

**Actual Result:** Request rejected with HTTP 401 Unauthorized.

**Status:** PASS

---

## Test 6: Update Job Without Authentication

**Test ID:** TC-06  
**Endpoint:** `PUT /api/jobs/:id`  
**Method:** PUT

**Purpose:** Verify that unauthenticated users cannot update jobs.

**Expected Result:**
- HTTP Status: 401 Unauthorized
- Authentication required.

**Actual Result:** Request rejected with HTTP 401 Unauthorized.

**Status:** PASS

---

## Test 7: Create Job With Authentication

**Test ID:** TC-07  
**Endpoint:** `POST /api/jobs`  
**Method:** POST

**Purpose:** Verify that authenticated staff can create a job posting.

**Expected Result:**
- HTTP Status: 201 Created
- Job saved in MongoDB.

**Actual Result:** Authenticated staff successfully created a job posting, and the job was saved in MongoDB.

**Status:** PASS

---

## Test 8: Update Job With Authentication

**Test ID:** TC-08  
**Endpoint:** `PUT /api/jobs/:id`  
**Method:** PUT

**Purpose:** Verify that authenticated staff can update a job posting.

**Expected Result:**
- HTTP Status: 200 OK
- Updated job returned.

**Actual Result:** Authenticated staff successfully updated the job posting.

**Status:** PASS

## Test 9: Submit Application

**Test ID:** TC-09

**Endpoint:** `POST /api/applications`

**Method:** POST

**Purpose:** Verify that a candidate can submit an application for an available job and receive a skill-match analysis.

**Expected Result:**
- HTTP Status: 201 Created
- Application saved successfully in MongoDB.
- Matched skills returned.
- Missing skills returned.
- Match score calculated by the backend.

**Actual Result:** Application submitted successfully. Skill matching and match-score calculation completed, and the application was saved in MongoDB.

**Status:** PASS

## Test 10: Staff Login

**Test ID:** TC-10

**Endpoint:** `POST /api/admin/auth/login`

**Method:** POST

**Purpose:** Verify that valid staff credentials generate an authentication token.

**Expected Result:**
- HTTP Status: 200 OK
- Staff credentials verified successfully.
- JWT access token generated.
- Staff details returned.

**Actual Result:** Staff login completed successfully. Valid credentials were verified, and a JWT access token was generated.

**Status:** PASS

---

## Test 11: Verify Staff Authentication

**Test ID:** TC-11

**Endpoint:** `GET /api/admin/auth/me`

**Method:** GET

**Purpose:** Verify that a valid JWT access token grants access to the protected staff profile endpoint.

**Expected Result:**
- HTTP Status: 200 OK
- Staff details returned.
- Staff role verified successfully.

**Actual Result:** Valid JWT access token was accepted, and authenticated staff details were returned.

**Status:** PASS
## Test 12: Retrieve All Applications

**Test ID:** TC-12

**Endpoint:** `GET /api/admin/applications`

**Method:** GET

**Purpose:** Verify that authenticated staff can retrieve all submitted applications.

**Expected Result:**
- HTTP Status: 200 OK
- Success: true
- Application count returned.
- Candidate and job details included.

**Actual Result:** All submitted applications were retrieved successfully with candidate and associated job details.

**Status:** PASS

---

## Test 13: Filter Applications By Job

**Test ID:** TC-13

**Endpoint:** `GET /api/admin/applications?job_id=JOB_ID`

**Method:** GET

**Purpose:** Verify that staff can retrieve applications for a specific job posting.

**Expected Result:**
- HTTP Status: 200 OK
- Only applications associated with the specified job returned.

**Actual Result:** Applications were successfully filtered using the selected job ID.

**Status:** PASS

---

## Test 14: Access Applications Without Authentication

**Test ID:** TC-14

**Endpoint:** `GET /api/admin/applications`

**Method:** GET

**Purpose:** Verify that unauthenticated users cannot access application records.

**Expected Result:**
- HTTP Status: 401 Unauthorized
- Authentication required.

**Actual Result:** Request was rejected because no valid authentication token was provided.

**Status:** PASS

---

## Test 15: Filter Applications Using Invalid Job ID

**Test ID:** TC-15

**Endpoint:** `GET /api/admin/applications?job_id=12345`

**Method:** GET

**Purpose:** Verify that invalid MongoDB job IDs are rejected.

**Expected Result:**
- HTTP Status: 400 Bad Request
- Invalid job ID message returned.

**Actual Result:** Invalid job ID was rejected with HTTP 400 Bad Request.

**Status:** PASS
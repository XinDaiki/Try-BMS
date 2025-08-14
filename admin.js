 document.addEventListener('DOMContentLoaded', function() {
        // Sidebar active/hover effect
        function updateSidebarActive(tabId) {
            const sidebarButtons = document.querySelectorAll('.sidebar-btn');
            sidebarButtons.forEach(btn => btn.classList.remove('active'));
            if (tabId === 'dashboardMain') {
                sidebarButtons[0].classList.add('active');
            } else if (tabId === 'residentsSection') {
                sidebarButtons[1].classList.add('active');
            } else if (tabId === 'officialsSection') {
                sidebarButtons[2].classList.add('active');
            } else if (tabId === 'complaintsSection') {
                sidebarButtons[3].classList.add('active');
            } else if (tabId === 'documentsSection') {
                sidebarButtons[4].classList.add('active');
            }
        }
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) { window.location.href = 'login.html'; return; }
        const user = JSON.parse(currentUser);
        document.getElementById('sidebarUserName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('sidebarUserRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        document.getElementById('topBarUserName').textContent = `${user.firstName} ${user.lastName}`;

        // Sidebar tab switching with active highlight
        window.showTab = function(tabId) {
            ['dashboardMain','residentsSection','officialsSection','complaintsSection','documentsSection'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
            const showEl = document.getElementById(tabId);
            if (showEl) showEl.classList.remove('hidden');
            const sidebarButtons = document.querySelectorAll('aside nav ul li button');
            sidebarButtons.forEach(btn => btn.classList.remove('bg-red-500','text-white','font-semibold'));
            if (tabId === 'dashboardMain') {
                sidebarButtons[0].classList.add('bg-red-500','text-white','font-semibold');
            } else if (tabId === 'residentsSection') {
                sidebarButtons[1].classList.add('bg-gray-800','text-white','font-semibold');
            } else if (tabId === 'officialsSection') {
                sidebarButtons[2].classList.add('bg-gray-800','text-white','font-semibold');
            } else if (tabId === 'complaintsSection') {
                sidebarButtons[3].classList.add('bg-gray-800','text-white','font-semibold');
            } else if (tabId === 'documentsSection') {
                sidebarButtons[4].classList.add('bg-gray-800','text-white','font-semibold');
            }
        };
        // Default tab
        showTab('dashboardMain');

        // Load Residents
        function loadResidents() {
            const residents = window.barangayApi.getUsers().filter(u => ['resident','kagawad','chairman','official'].includes(u.role));
                let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2 text-center">Name</th><th class="border px-4 py-2 text-center">Role</th><th class="border px-4 py-2 text-center">Username</th><th class="border px-4 py-2 text-center">Email</th><th class="border px-4 py-2 text-center">Action</th></tr></thead><tbody>';
            residents.forEach(r => {
                    html += `<tr><td class='border px-4 py-2 text-center'>${r.firstName} ${r.lastName}</td><td class='border px-4 py-2 text-center'>${r.role}</td><td class='border px-4 py-2 text-center'>${r.username}</td><td class='border px-4 py-2 text-center'>${r.email}</td><td class='border px-4 py-2 text-center'><button onclick="deleteResident(${r.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button></td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('residentsTableBody').innerHTML = html;
        }

        // Load Officials
        function loadOfficials() {
            const officials = window.barangayApi.getUsers().filter(u => ['kagawad','chairman','official','admin'].includes(u.role));
                let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2 text-center">Name</th><th class="border px-4 py-2 text-center">Role</th><th class="border px-4 py-2 text-center">Username</th><th class="border px-4 py-2 text-center">Email</th></tr></thead><tbody>';
            officials.forEach(o => {
                    html += `<tr><td class='border px-4 py-2 text-center'>${o.firstName} ${o.lastName}</td><td class='border px-4 py-2 text-center'>${o.role}</td><td class='border px-4 py-2 text-center'>${o.username}</td><td class='border px-4 py-2 text-center'>${o.email}</td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('officialsTableBody').innerHTML = html;
        }

        // Load Complaints
        function loadComplaints() {
            const complaints = window.barangayApi.getComplaints();
                let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2 text-center">Resident</th><th class="border px-4 py-2 text-center">Type</th><th class="border px-4 py-2 text-center">Subject</th><th class="border px-4 py-2 text-center">Description</th><th class="border px-4 py-2 text-center">Status</th><th class="border px-4 py-2 text-center">Action</th></tr></thead><tbody>';
            complaints.forEach(c => {
                const resident = window.barangayApi.getUsers().find(u => u.id === c.userId);
                    html += `<tr><td class='border px-4 py-2 text-center'>${resident ? resident.firstName + ' ' + resident.lastName : 'Unknown'}</td><td class='border px-4 py-2 text-center'>${c.type}</td><td class='border px-4 py-2 text-center'>${c.subject}</td><td class='border px-4 py-2 text-center'>${c.description}</td><td class='border px-4 py-2 text-center'>${c.status}</td><td class='border px-4 py-2 text-center'><button onclick="deleteComplaint(${c.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button></td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('complaintsTableBody').innerHTML = html;
        }

        // Load Documents
        function loadDocuments() {
            const documents = window.barangayApi.getDocuments();
                let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2 text-center">Resident</th><th class="border px-4 py-2 text-center">Type</th><th class="border px-4 py-2 text-center">Purpose</th><th class="border px-4 py-2 text-center">Status</th><th class="border px-4 py-2 text-center">Action</th></tr></thead><tbody>';
            documents.forEach(doc => {
                const resident = window.barangayApi.getUsers().find(u => u.id === doc.userId);
                    html += `<tr><td class='border px-4 py-2 text-center'>${resident ? resident.firstName + ' ' + resident.lastName : 'Unknown'}</td><td class='border px-4 py-2 text-center'>${doc.type}</td><td class='border px-4 py-2 text-center'>${doc.purpose}</td><td class='border px-4 py-2 text-center' id="doc-status-${doc.id}">${doc.status}</td><td class='border px-4 py-2 text-center'><button onclick="updateDocumentStatus(${doc.id},'approved')" class="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button><button onclick="updateDocumentStatus(${doc.id},'denied')" class="bg-red-500 text-white px-2 py-1 rounded mr-2">Deny</button><button onclick="deleteDocument(${doc.id})" class="bg-red-700 text-white px-2 py-1 rounded">Delete</button></td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('documentsTableBody').innerHTML = html;
    // Delete Resident
    window.deleteResident = function(userId) {
        if (!confirm('Are you sure you want to delete this resident?')) return;
        const db = JSON.parse(localStorage.getItem('barangayDb'));
        db.users = db.users.filter(u => u.id !== userId);
        localStorage.setItem('barangayDb', JSON.stringify(db));
        // Reload table
        document.getElementById('residentsTableBody').innerHTML = '';
        loadResidents();
    };

    // Delete Complaint
    window.deleteComplaint = function(complaintId) {
        if (!confirm('Are you sure you want to delete this complaint?')) return;
        const db = JSON.parse(localStorage.getItem('barangayDb'));
        db.complaints = db.complaints.filter(c => c.id !== complaintId);
        localStorage.setItem('barangayDb', JSON.stringify(db));
        document.getElementById('complaintsTableBody').innerHTML = '';
        loadComplaints();
    };

    // Delete Document
    window.deleteDocument = function(docId) {
        if (!confirm('Are you sure you want to delete this document request?')) return;
        const db = JSON.parse(localStorage.getItem('barangayDb'));
        db.documents = db.documents.filter(d => d.id !== docId);
        localStorage.setItem('barangayDb', JSON.stringify(db));
        document.getElementById('documentsTableBody').innerHTML = '';
        loadDocuments();
    };
        }

        // Document status update function
        window.updateDocumentStatus = function(docId, status) {
            const db = JSON.parse(localStorage.getItem('barangayDb'));
            const doc = db.documents.find(d => d.id === docId);
            if (doc) {
                doc.status = status;
                doc.updatedAt = new Date().toISOString();
                localStorage.setItem('barangayDb', JSON.stringify(db));
                document.getElementById('doc-status-' + docId).textContent = status;
            }
        };

        // Load all tables on tab show
        window.showTab = function(tabId) {
            ['dashboardMain','residentsSection','officialsSection','complaintsSection','documentsSection'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
            const showEl = document.getElementById(tabId);
            if (showEl) showEl.classList.remove('hidden');
            updateSidebarActive(tabId);
            if (tabId === 'residentsSection') {
                loadResidents();
            } else if (tabId === 'officialsSection') {
                loadOfficials();
            } else if (tabId === 'complaintsSection') {
                loadComplaints();
            } else if (tabId === 'documentsSection') {
                loadDocuments();
            }
        };
        // Default tab
        showTab('dashboardMain');
        // Add Resident button logic
        const addBtn = document.getElementById('addResidentBtn');
        const addForm = document.getElementById('addResidentForm');
        const cancelBtn = document.getElementById('cancelAddResident');
        if (addBtn && addForm && cancelBtn) {
            addBtn.onclick = function() {
                addForm.classList.remove('hidden');
            };
            cancelBtn.onclick = function() {
                addForm.classList.add('hidden');
                document.getElementById('residentForm').reset();
                document.getElementById('residentAddError').textContent = '';
            };
            document.getElementById('residentForm').onsubmit = function(e) {
                e.preventDefault();
                const firstName = document.getElementById('residentFirstName').value.trim();
                const lastName = document.getElementById('residentLastName').value.trim();
                const username = document.getElementById('residentUsername').value.trim();
                const email = document.getElementById('residentEmail').value.trim();
                const password = document.getElementById('residentPassword').value;
                const role = document.getElementById('residentRole').value;
                const errorDiv = document.getElementById('residentAddError');
                errorDiv.textContent = '';
                if (!firstName || !lastName || !username || !email || !password || !role) {
                    errorDiv.textContent = 'Please fill in all fields.';
                    return;
                }
                const result = window.barangayApi.register({firstName,lastName,username,password,email,role});
                if (result.success) {
                    addForm.classList.add('hidden');
                    document.getElementById('residentForm').reset();
                    loadResidents();
                } else {
                    errorDiv.textContent = result.message || 'Failed to add resident.';
                }
            };
        }
    });
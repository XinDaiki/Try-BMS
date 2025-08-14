 document.addEventListener('DOMContentLoaded', function() {
        // Sidebar active/hover effect
        function updateSidebarActive(tabId) {
            const sidebarButtons = document.querySelectorAll('.sidebar-btn');
            sidebarButtons.forEach(btn => btn.classList.remove('active'));
            if (tabId === 'dashboardMain') {
                sidebarButtons[0].classList.add('active');
            } else if (tabId === 'complaintsSection') {
                sidebarButtons[1].classList.add('active');
            } else if (tabId === 'officialsSection') {
                sidebarButtons[2].classList.add('active');
            } else if (tabId === 'documentsSection') {
                sidebarButtons[3].classList.add('active');
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
            ['dashboardMain','complaintsSection','officialsSection','documentsSection'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
            const showEl = document.getElementById(tabId);
            if (showEl) showEl.classList.remove('hidden');
            updateSidebarActive(tabId);
            if (tabId === 'officialsSection') {
                loadOfficials();
            } else if (tabId === 'complaintsSection') {
                loadMyComplaints();
            } else if (tabId === 'documentsSection') {
                loadMyDocuments();
            }
        };
        // Default tab
        showTab('dashboardMain');

        // Load Officials
        function loadOfficials() {
            const officials = window.barangayApi.getUsers().filter(u => ['kagawad','chairman','official','admin'].includes(u.role));
            let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2">Name</th><th class="border px-4 py-2">Role</th><th class="border px-4 py-2">Username</th><th class="border px-4 py-2">Email</th></tr></thead><tbody>';
            officials.forEach(o => {
                html += `<tr><td class='border px-4 py-2'>${o.firstName} ${o.lastName}</td><td class='border px-4 py-2'>${o.role}</td><td class='border px-4 py-2'>${o.username}</td><td class='border px-4 py-2'>${o.email}</td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('officialsTableBody').innerHTML = html;
        }

        // Complaint Form
        document.getElementById('complaintForm').onsubmit = function(e) {
            e.preventDefault();
            const type = document.getElementById('complaintType').value.trim();
            const subject = document.getElementById('complaintSubject').value.trim();
            const description = document.getElementById('complaintDescription').value.trim();
            const errorDiv = document.getElementById('complaintError');
            errorDiv.textContent = '';
            if (!type || !subject || !description) {
                errorDiv.textContent = 'Please fill in all fields.';
                return;
            }
            const result = window.barangayApi.createComplaint({
                userId: user.id,
                type,
                subject,
                description
            });
            if (result.success) {
                document.getElementById('complaintForm').reset();
                loadMyComplaints();
            } else {
                errorDiv.textContent = result.message || 'Failed to submit complaint.';
            }
        };
        // Load My Complaints
        function loadMyComplaints() {
            const complaints = window.barangayApi.getComplaints(user.id);
            let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2">Type</th><th class="border px-4 py-2">Subject</th><th class="border px-4 py-2">Description</th><th class="border px-4 py-2">Status</th></tr></thead><tbody>';
            complaints.forEach(c => {
                html += `<tr><td class='border px-4 py-2'>${c.type}</td><td class='border px-4 py-2'>${c.subject}</td><td class='border px-4 py-2'>${c.description}</td><td class='border px-4 py-2'>${c.status}</td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('myComplaints').innerHTML = html;
        }

        // Document Form
        document.getElementById('documentForm').onsubmit = function(e) {
            e.preventDefault();
            const type = document.getElementById('documentType').value.trim();
            const purpose = document.getElementById('documentPurpose').value.trim();
            const errorDiv = document.getElementById('documentError');
            errorDiv.textContent = '';
            if (!type || !purpose) {
                errorDiv.textContent = 'Please fill in all fields.';
                return;
            }
            const result = window.barangayApi.createDocument({
                userId: user.id,
                type,
                purpose
            });
            if (result.success) {
                document.getElementById('documentForm').reset();
                loadMyDocuments();
            } else {
                errorDiv.textContent = result.message || 'Failed to request document.';
            }
        };
        // Load My Documents
        function loadMyDocuments() {
            const documents = window.barangayApi.getDocuments(user.id);
            let html = '<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden"><thead class="bg-gray-100"><tr><th class="border px-4 py-2">Type</th><th class="border px-4 py-2">Purpose</th><th class="border px-4 py-2">Status</th></tr></thead><tbody>';
            documents.forEach(doc => {
                html += `<tr><td class='border px-4 py-2'>${doc.type}</td><td class='border px-4 py-2'>${doc.purpose}</td><td class='border px-4 py-2'>${doc.status}</td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('myDocuments').innerHTML = html;
        }
    });
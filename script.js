(function() {
    window.logout = function() {
        window.location.href = 'login.html';
    };
})();
// This simulates a backend with database functionality using localStorage
(function() {
    // Database structure
    if (!localStorage.getItem('barangayDb')) {
        const initialDb = {
            users: [
                {
                    id: 1,
                    firstName: 'Barangay',
                    lastName: 'Admin',
                    username: 'admin',
                    password: 'admin123', // In real app, this would be hashed
                    email: 'admin@barangay.gov',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    firstName: 'Juan',
                    lastName: 'Dela Cruz',
                    username: 'chairman',
                    password: 'chairman123',
                    email: 'chairman@barangay.gov',
                    role: 'chairman',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    firstName: 'Maria',
                    lastName: 'Santos',
                    username: 'kagawad1',
                    password: 'kagawad123',
                    email: 'kagawad1@barangay.gov',
                    role: 'kagawad',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    firstName: 'Pedro',
                    lastName: 'Reyes',
                    username: 'official1',
                    password: 'official123',
                    email: 'official1@barangay.gov',
                    role: 'official',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    firstName: 'Ana',
                    lastName: 'Garcia',
                    username: 'resident1',
                    password: 'resident123',
                    email: 'resident1@barangay.gov',
                    role: 'resident',
                    createdAt: new Date().toISOString()
                }
            ],
            documents: [],
            complaints: []
        };
        localStorage.setItem('barangayDb', JSON.stringify(initialDb));
    }

    // Get the entire database
    function getDb() {
        return JSON.parse(localStorage.getItem('barangayDb'));
    }

    // Save the entire database
    function saveDb(db) {
        localStorage.setItem('barangayDb', JSON.stringify(db));
    }

    // API simulation
    window.barangayApi = {
        // User authentication
        login: function(username, password) {
            const db = getDb();
            const user = db.users.find(u => u.username === username && u.password === password);
            
            if (user) {
                return {
                    success: true,
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid username or password'
                };
            }
        },

        // User registration
        register: function(userData) {
    const db = getDb();
            
            // Check if username already exists
            const usernameExists = db.users.some(u => u.username === userData.username);
            if (usernameExists) {
                return {
                    success: false,
                    message: 'Username already exists'
                };
            }
            
            // Check if email already exists
            const emailExists = db.users.some(u => u.email === userData.email);
            if (emailExists) {
                return {
                    success: false,
                    message: 'Email already exists'
                };
            }
            
            // Create new user
            const newUser  = {
                id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
                password: userData.password, // In real app, this would be hashed
                email: userData.email,
                role: userData.role,
                createdAt: new Date().toISOString()
            };
            
            db.users.push(newUser );
            saveDb(db);
            
            return {
                success: true,
                user: {
                    id: newUser .id,
                    firstName: newUser .firstName,
                    lastName: newUser .lastName,
                    username: newUser .username,
                    email: newUser .email,
                    role: newUser .role
                }
            };
        },

        // Get all users (admin only)
        getUsers: function() {
            const db = getDb();
            return db.users.map(user => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }));
        },

        // Add new user (admin only)
        add: function(userData) {
    return this.register(userData);
},

        // Get current user
        getCurrent:  function(userId) {
            const db = getDb();
            const user = db.users.find(u => u.id === userId);
            if (user) {
                return {
                    success: true,
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'User  not found'
                };
            }
        },

        // Document management
        getDocuments: function(userId = null) {
            const db = getDb();
            if (userId) {
                return db.documents.filter(doc => doc.userId === userId);
            }
            return db.documents;
        },

        createDocument: function(documentData) {
            const db = getDb();
            const newDoc = {
                id: db.documents.length > 0 ? Math.max(...db.documents.map(d => d.id)) + 1 : 1,
                userId: documentData.userId,
                type: documentData.type,
                purpose: documentData.purpose,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            db.documents.push(newDoc);
            saveDb(db);
            
            return {
                success: true,
                document: newDoc
            };
        },

        // Complaint management
        getComplaints: function(userId = null) {
            const db = getDb();
            if (userId) {
                return db.complaints.filter(c => c.userId === userId);
            }
            return db.complaints;
        },

        createComplaint: function(complaintData) {
            const db = getDb();
            const newComplaint = {
                id: db.complaints.length > 0 ? Math.max(...db.complaints.map(c => c.id)) + 1 : 1,
                userId: complaintData.userId,
                type: complaintData.type,
                subject: complaintData.subject,
                description: complaintData.description,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            db.complaints.push(newComplaint);
            saveDb(db);
            
            return {
                success: true,
                complaint: newComplaint
            };
        }
    };
})();


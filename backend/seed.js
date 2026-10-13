const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Client = require('./models/Client');
const Project = require('./models/Project');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancer_tracker';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // Remove existing demo user if present
    await User.deleteMany({ email: 'freelancer@demo.com' });

    // Create Demo User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Alex Morgan',
      email: 'freelancer@demo.com',
      password: hashedPassword,
      companyName: 'Apex Creative Studio',
    });

    console.log(`✅ Created Demo User: ${user.email} (Password: password123)`);

    // Clean up demo clients & projects
    await Client.deleteMany({ user: user._id });
    await Project.deleteMany({ user: user._id });

    // Create Sample Clients
    const client1 = await Client.create({
      user: user._id,
      name: 'Acme Global Corp',
      email: 'contact@acmeglobal.com',
      company: 'Acme Corp',
      phone: '+1 (555) 234-5678',
      status: 'Active',
      notes: 'Key enterprise client for web applications.',
    });

    const client2 = await Client.create({
      user: user._id,
      name: 'Starlight Tech Inc',
      email: 'billing@starlighttech.io',
      company: 'Starlight Tech',
      phone: '+1 (555) 876-5432',
      status: 'Active',
      notes: 'Mobile app UI/UX design & development.',
    });

    const client3 = await Client.create({
      user: user._id,
      name: 'Nexus Ventures',
      email: 'projects@nexusventures.co',
      company: 'Nexus Ventures',
      phone: '+1 (555) 432-1098',
      status: 'Active',
      notes: 'Branding and dashboard analytics project.',
    });

    console.log('✅ Created 3 Sample Clients');

    // Create Sample Projects
    const projects = [
      {
        user: user._id,
        client: client1._id,
        title: 'Full Stack E-Commerce Platform',
        description: 'React & Node.js scalable shopping cart with Stripe integration.',
        fee: 4500,
        amountPaid: 4500,
        status: 'Paid',
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: client2._id,
        title: 'Mobile App UI/UX Redesign',
        description: 'Figma prototypes and Flutter frontend component library.',
        fee: 2800,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: client3._id,
        title: 'Analytics Dashboard Integration',
        description: 'Interactive data visualization charts using Recharts.',
        fee: 3200,
        amountPaid: 3200,
        status: 'Paid',
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: client1._id,
        title: 'REST API Performance Tuning',
        description: 'Database query optimization and Express middleware caching.',
        fee: 1800,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: client2._id,
        title: 'Branding & Landing Page System',
        description: 'Glassmorphism dark theme website design.',
        fee: 2200,
        amountPaid: 0,
        status: 'Completed',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];

    await Project.insertMany(projects);
    console.log('✅ Created 5 Sample Projects & Income Records');

    console.log('\n=============================================');
    console.log('🎉 SEEDING COMPLETE!');
    console.log('Login Credentials:');
    console.log('Email:    freelancer@demo.com');
    console.log('Password: password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    process.exit(1);
  }
};

seedData();

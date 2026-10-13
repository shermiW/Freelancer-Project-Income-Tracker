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

    // Create Demo User (Alex Morgan)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Alex Morgan',
      email: 'freelancer@demo.com',
      password: hashedPassword,
      companyName: 'Product Designer',
    });

    console.log(`✅ Created Demo User: ${user.email} (Password: password123)`);

    // Clean up demo clients & projects
    await Client.deleteMany({ user: user._id });
    await Project.deleteMany({ user: user._id });

    // Create Sample Clients
    const clientsData = [
      {
        user: user._id,
        name: 'Acme Studio',
        email: 'hello@acmestudio.com',
        company: 'Acme Corp',
        phone: '+1 (555) 234-5678',
        status: 'Active',
        notes: 'Enterprise SaaS client for UI/UX systems.',
      },
      {
        user: user._id,
        name: 'Starlight Tech Inc',
        email: 'billing@starlighttech.io',
        company: 'Starlight Inc',
        phone: '+1 (555) 876-5432',
        status: 'Active',
        notes: 'Mobile iOS & Android design projects.',
      },
      {
        user: user._id,
        name: 'Nexus Ventures',
        email: 'projects@nexusventures.co',
        company: 'Nexus Group',
        phone: '+1 (555) 432-1098',
        status: 'Active',
        notes: 'Fintech dashboards and brand assets.',
      },
      {
        user: user._id,
        name: 'Apex Creative Lab',
        email: 'contact@apexcreative.io',
        company: 'Apex Media',
        phone: '+1 (555) 321-9876',
        status: 'Active',
        notes: 'Landing pages and marketing assets.',
      },
    ];

    const createdClients = await Client.insertMany(clientsData);
    const [c1, c2, c3, c4] = createdClients;
    console.log(`✅ Created ${createdClients.length} Sample Clients`);

    // Create 24 Projects matching the reference dashboard:
    // 12 Completed/Paid = $35,950 total paid
    // 6 In Progress = $32,150 total pending
    // 6 Pending = $28,000 total pending
    // Total Pending = $60,150 across 12 unpaid projects!
    const projects = [
      // --- 12 COMPLETED / PAID PROJECTS (Total Paid: $35,950) ---
      {
        user: user._id,
        client: c1._id,
        title: 'Design System & Component Kit',
        description: 'Comprehensive Figma token library and accessible component guidelines.',
        fee: 4500,
        amountPaid: 4500,
        status: 'Completed',
        dueDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c2._id,
        title: 'iOS Mobile App Wireframes',
        description: 'Native mobile app user flows, wireframes, and interactive prototype.',
        fee: 3800,
        amountPaid: 3800,
        status: 'Completed',
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c3._id,
        title: 'Fintech Dashboard Analytics UI',
        description: 'Real-time chart views, transaction ledger, and summary cards.',
        fee: 5200,
        amountPaid: 5200,
        status: 'Completed',
        dueDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'SaaS Marketing Landing Page',
        description: 'Responsive high-converting landing page with 3D illustration assets.',
        fee: 2900,
        amountPaid: 2900,
        status: 'Completed',
        dueDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c1._id,
        title: 'Brand Identity & Iconography Guide',
        description: 'Vector logo package, color palettes, and typographic scale.',
        fee: 2400,
        amountPaid: 2400,
        status: 'Completed',
        dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c2._id,
        title: 'Dark Mode Web Application Theme',
        description: 'Color token mapping and high-contrast accessibility compliance.',
        fee: 1850,
        amountPaid: 1850,
        status: 'Completed',
        dueDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c3._id,
        title: 'User Onboarding Flow Experience',
        description: 'Multi-step signup wizard and profile setup micro-interactions.',
        fee: 3100,
        amountPaid: 3100,
        status: 'Completed',
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'Product Presentation Deck Design',
        description: 'Investor pitch slides and visual storytelling graphic assets.',
        fee: 1600,
        amountPaid: 1600,
        status: 'Completed',
        dueDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c1._id,
        title: 'Checkout Flow UX Audit & Wireframes',
        description: 'Cart abandonment reduction and friction-free payment UI.',
        fee: 2750,
        amountPaid: 2750,
        status: 'Completed',
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c2._id,
        title: 'Customer Portal UI Redesign',
        description: 'Account settings, notification preferences, and billing portal.',
        fee: 3450,
        amountPaid: 3450,
        status: 'Completed',
        dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c3._id,
        title: 'Mobile Navigation Animation Specs',
        description: 'Lottie animations and gesture transitions documentation.',
        fee: 2150,
        amountPaid: 2150,
        status: 'Completed',
        dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'Email Newsletter Templates',
        description: 'Responsive transactional and promotional Figma designs.',
        fee: 2250,
        amountPaid: 2250,
        status: 'Completed',
        dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },

      // --- 6 IN PROGRESS PROJECTS (Total: $32,150) ---
      {
        user: user._id,
        client: c1._id,
        title: 'Enterprise Analytics Suite V2',
        description: 'Complex data tables, export dialogs, and customizable metric widgets.',
        fee: 7500,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c2._id,
        title: 'AI Assistant Interface & Prompts',
        description: 'Conversational chat layout, streaming typography, and prompt suggestions.',
        fee: 6200,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c3._id,
        title: 'Multi-Tenant Permissions Matrix',
        description: 'Role-based access control UI and audit logs viewer.',
        fee: 4800,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'Creator Marketplace App UI',
        description: 'Discovery feed, creator profile cards, and tipping flow.',
        fee: 5450,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c1._id,
        title: 'Cloud Billing & Invoice Portal',
        description: 'Usage-based metering charts, tax summary, and PDF download modals.',
        fee: 4300,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c2._id,
        title: 'Design System Documentation Website',
        description: 'Storybook theme, usage examples, and token export tool.',
        fee: 3900,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      },

      // --- 6 PENDING PROJECTS (Total: $28,000) ---
      {
        user: user._id,
        client: c3._id,
        title: 'Mobile App Tablet Responsive Layout',
        description: 'Adaptive iPad and Android tablet screen layouts.',
        fee: 5100,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'Global Search & Command Palette',
        description: 'Keyboard navigation shortcut modal (Cmd+K) with recent searches.',
        fee: 3600,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c1._id,
        title: 'Web Accessibility (WCAG AAA) Audit',
        description: 'Contrast checks, screen reader landmarks, and keyboard focus states.',
        fee: 4200,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c2._id,
        title: 'Interactive 3D Product Configurator',
        description: 'Three.js UI overlay, material switcher, and camera angle controls.',
        fee: 6500,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c3._id,
        title: 'Cross-Platform Push Notifications UI',
        description: 'In-app banner styles, badge counts, and user preference toggles.',
        fee: 3800,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'Referral & Affiliate Growth Engine',
        description: 'Share link generator, reward tier tracker, and payouts history.',
        fee: 4800,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      },
    ];

    await Project.insertMany(projects);
    console.log(`✅ Created ${projects.length} Sample Projects matching Dashboard stats!`);

    console.log('\n=============================================');
    console.log('🎉 SEEDING COMPLETE!');
    console.log('Total Projects:      24');
    console.log('Completed Projects:  12 ($35,950 total paid)');
    console.log('In Progress:         6  (Active)');
    console.log('Pending:             6');
    console.log('Pending Payments:    $60,150 across 12 unpaid projects');
    console.log('Login Email:         freelancer@demo.com');
    console.log('Login Password:      password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    process.exit(1);
  }
};

seedData();

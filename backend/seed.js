const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Client = require('./models/Client');
const Project = require('./models/Project');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancer_tracker';
      console.log(`Connecting to MongoDB at: ${mongoUri}`);
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB.');
    }

    // Remove existing demo user if present
    await User.deleteMany({ email: 'freelancer@demo.com' });

    // Create Demo User (Alex Morgan) - User pre('save') hook will hash this password
    const user = await User.create({
      name: 'Alex Morgan',
      email: 'freelancer@demo.com',
      password: 'password123',
      companyName: 'Product Designer',
    });

    console.log(`✅ Created Demo User: ${user.email} (Password: password123)`);

    // Clean up demo clients & projects
    await Client.deleteMany({ user: user._id });
    await Project.deleteMany({ user: user._id });

    // 8 Clients matching the exact Clients directory view screenshot
    const clientsData = [
      {
        user: user._id,
        name: 'Sarah Chen',
        email: 'sarah@northwind.studio',
        company: 'Northwind Studio',
        phone: '+1 (415) 555-0142',
        status: 'Active',
      },
      {
        user: user._id,
        name: 'Marcus Bell',
        email: 'marcus@lumencoffee.com',
        company: 'Lumen Coffee Co.',
        phone: '+1 (503) 555-0198',
        status: 'Active',
      },
      {
        user: user._id,
        name: 'Priya Raman',
        email: 'priya.raman@fieldnote.health',
        company: 'Fieldnote Health',
        phone: '+1 (617) 555-0117',
        status: 'Active',
      },
      {
        user: user._id,
        name: 'Diego Alvarez',
        email: 'diego@atlasfreight.io',
        company: 'Atlas Freight',
        phone: '+1 (312) 555-0163',
        status: 'Active',
      },
      {
        user: user._id,
        name: 'Hannah Okafor',
        email: 'hannah@brightside.edu',
        company: 'Brightside Learning',
        phone: '+1 (206) 555-0129',
        status: 'Active',
      },
      {
        user: user._id,
        name: 'Tom Whitaker',
        email: 'tom@whitakerlaw.com',
        company: 'Whitaker & Co. Law',
        phone: '+1 (212) 555-0184',
        status: 'Active',
      },
      {
        user: user._id,
        name: 'Elena Petrova',
        email: 'elena@orbitfin.co',
        company: 'Orbit Fintech',
        phone: '+1 (646) 555-0151',
        status: 'Active',
      },
      {
        user: user._id,
        name: 'Jamal Harris',
        email: 'jamal@peakoutdoors.com',
        company: 'Peak Outdoors',
        phone: '+1 (720) 555-0176',
        status: 'Active',
      },
    ];

    const createdClients = await Client.insertMany(clientsData);
    const [c1, c2, c3, c4, c5, c6, c7, c8] = createdClients;
    console.log(`✅ Created ${createdClients.length} Sample Clients`);

    // 24 Projects total matching the Tally Projects & Dashboard metrics
    const projects = [
      // 1. Top 5 exact projects visible in screenshot
      {
        user: user._id,
        client: c1._id,
        title: 'Brand Identity Refresh',
        description: 'New logo system, typography and brand guidelines.',
        fee: 4800,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date('2026-10-24T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c2._id,
        title: 'E-commerce Storefront',
        description: 'High converting shopping cart and headless Shopify UI.',
        fee: 7200,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date('2026-11-08T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c3._id,
        title: 'Patient Portal UX Audit',
        description: 'Telehealth patient intake forms and doctor dashboard audit.',
        fee: 3500,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date('2026-11-15T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'Fleet Tracking Dashboard',
        description: 'Logistics telematics map, driver routing, and live fleet status.',
        fee: 9600,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date('2026-12-01T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c5._id,
        title: 'Course Landing Pages',
        description: 'Conversion-optimized curriculum landing pages and video embeds.',
        fee: 2400,
        amountPaid: 2400,
        status: 'Completed',
        dueDate: new Date('2026-10-03T00:00:00.000Z'),
        paidDate: new Date('2026-10-03T00:00:00.000Z'),
      },

      // Remaining projects to reach 24 projects (6 In Progress, 6 Pending, 12 Completed)
      {
        user: user._id,
        client: c1._id,
        title: 'Design System & Component Kit',
        fee: 4500,
        amountPaid: 4500,
        status: 'Completed',
        dueDate: new Date('2026-09-18T00:00:00.000Z'),
        paidDate: new Date('2026-09-18T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c2._id,
        title: 'Mobile App Wireframes & Flow',
        fee: 3800,
        amountPaid: 3800,
        status: 'Completed',
        dueDate: new Date('2026-09-12T00:00:00.000Z'),
        paidDate: new Date('2026-09-12T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c3._id,
        title: 'Fintech Dashboard Analytics',
        fee: 5200,
        amountPaid: 5200,
        status: 'Completed',
        dueDate: new Date('2026-08-25T00:00:00.000Z'),
        paidDate: new Date('2026-08-25T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'SaaS Marketing Site Redesign',
        fee: 2900,
        amountPaid: 2900,
        status: 'Completed',
        dueDate: new Date('2026-08-15T00:00:00.000Z'),
        paidDate: new Date('2026-08-15T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c5._id,
        title: 'Brand Iconography Suite',
        fee: 2150,
        amountPaid: 2150,
        status: 'Completed',
        dueDate: new Date('2026-07-28T00:00:00.000Z'),
        paidDate: new Date('2026-07-28T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c1._id,
        title: 'Dark Mode Web Application Theme',
        fee: 1850,
        amountPaid: 1850,
        status: 'Completed',
        dueDate: new Date('2026-07-10T00:00:00.000Z'),
        paidDate: new Date('2026-07-10T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c2._id,
        title: 'User Onboarding Flow Experience',
        fee: 3100,
        amountPaid: 3100,
        status: 'Completed',
        dueDate: new Date('2026-06-20T00:00:00.000Z'),
        paidDate: new Date('2026-06-20T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c3._id,
        title: 'Product Presentation Deck',
        fee: 1600,
        amountPaid: 1600,
        status: 'Completed',
        dueDate: new Date('2026-06-05T00:00:00.000Z'),
        paidDate: new Date('2026-06-05T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'Checkout Flow UX Audit',
        fee: 2750,
        amountPaid: 2750,
        status: 'Completed',
        dueDate: new Date('2026-05-18T00:00:00.000Z'),
        paidDate: new Date('2026-05-18T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c5._id,
        title: 'Customer Portal UI Redesign',
        fee: 3450,
        amountPaid: 3450,
        status: 'Completed',
        dueDate: new Date('2026-04-22T00:00:00.000Z'),
        paidDate: new Date('2026-04-22T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c1._id,
        title: 'Email Newsletter Templates',
        fee: 2250,
        amountPaid: 2250,
        status: 'Completed',
        dueDate: new Date('2026-03-14T00:00:00.000Z'),
        paidDate: new Date('2026-03-14T00:00:00.000Z'),
      },
      // In Progress remaining (total 6 in progress: 3 above + 3 below)
      {
        user: user._id,
        client: c2._id,
        title: 'AI Assistant Interface & Prompts',
        fee: 6500,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date('2026-11-22T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c3._id,
        title: 'Multi-Tenant Permissions Matrix',
        fee: 5200,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date('2026-11-28T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'Creator Marketplace App UI',
        fee: 4800,
        amountPaid: 0,
        status: 'In Progress',
        dueDate: new Date('2026-12-05T00:00:00.000Z'),
      },
      // Pending remaining (total 6 pending: 1 above + 5 below)
      {
        user: user._id,
        client: c5._id,
        title: 'Mobile App Tablet Responsive Layout',
        fee: 5100,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date('2026-12-10T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c1._id,
        title: 'Global Search & Command Palette',
        fee: 3600,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date('2026-12-15T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c2._id,
        title: 'Web Accessibility (WCAG AAA) Audit',
        fee: 4200,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date('2026-12-20T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c3._id,
        title: 'Interactive 3D Product Configurator',
        fee: 6800,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date('2026-12-24T00:00:00.000Z'),
      },
      {
        user: user._id,
        client: c4._id,
        title: 'Cross-Platform Push Notifications UI',
        fee: 4800,
        amountPaid: 0,
        status: 'Pending',
        dueDate: new Date('2026-12-30T00:00:00.000Z'),
      },
    ];

    await Project.insertMany(projects);
    console.log(`✅ Created ${projects.length} Sample Projects matching screenshot!`);

    console.log('\n=============================================');
    console.log('🎉 SEEDING COMPLETE!');
    console.log('Login Email:         freelancer@demo.com');
    console.log('Login Password:      password123');
    console.log('=============================================\n');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    if (require.main === module) {
      process.exit(1);
    }
    throw err;
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;

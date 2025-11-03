// Default portfolio projects
const defaultProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform built with React and Node.js featuring real-time inventory management and secure payment processing.",
    longDescription: "This comprehensive e-commerce platform was designed to provide a seamless shopping experience for both customers and administrators. Built using React for the frontend and Node.js with Express for the backend, the platform features a responsive design that works flawlessly across all devices.\n\nKey features include:\n- Real-time inventory management\n- Secure payment processing with Stripe integration\n- Advanced product filtering and search\n- User account management\n- Order tracking and management\n- Admin dashboard with analytics\n\nThe project involved extensive planning, wireframing, and user testing to ensure optimal user experience. The backend API was designed with RESTful principles and includes comprehensive error handling and validation.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe API", "JWT", "SCSS"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
    ],
    liveUrl: "https://ecommerce-demo.kyleo.co.uk",
    githubUrl: "https://github.com/kyleo/ecommerce-platform",
    category: "web-development",
    status: "published",
    featured: true,
    completedDate: "2024-01-15",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
    slug: "ecommerce-platform"
  },
  {
    id: 2,
    title: "Corporate Website Redesign",
    description: "Complete redesign of a corporate website with focus on modern UI/UX principles and improved conversion rates.",
    longDescription: "This project involved a complete overhaul of a traditional corporate website that was outdated and not performing well in terms of user engagement and conversions. The challenge was to create a modern, professional appearance while maintaining the company's established brand identity.\n\nThe redesign process included:\n- Comprehensive UX audit of the existing site\n- User research and persona development\n- Wireframing and prototyping\n- Modern, responsive design implementation\n- Performance optimization\n- SEO improvements\n\nThe new design resulted in a 45% increase in user engagement and a 30% improvement in conversion rates. The site was built using modern web technologies with a focus on accessibility and performance.",
    technologies: ["HTML5", "CSS3", "JavaScript", "SCSS", "Webpack", "Figma"],
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"
    ],
    liveUrl: "https://corporate-redesign.kyleo.co.uk",
    githubUrl: "https://github.com/kyleo/corporate-redesign",
    category: "web-design",
    status: "published",
    featured: true,
    completedDate: "2023-11-20",
    createdAt: "2023-11-20T14:15:00.000Z",
    updatedAt: "2023-11-20T14:15:00.000Z",
    slug: "corporate-website-redesign"
  },
  {
    id: 3,
    title: "Recipe Sharing App",
    description: "A mobile-first web application for sharing and discovering recipes with social features and meal planning.",
    longDescription: "RecipeShare is a comprehensive web application designed to bring food enthusiasts together through recipe sharing and discovery. The app was built with a mobile-first approach, recognizing that most users would access it from their smartphones while cooking.\n\nKey features include:\n- Recipe creation with step-by-step instructions\n- Photo upload and gallery management\n- Social features (following, likes, comments)\n- Advanced search and filtering\n- Meal planning and shopping list generation\n- Nutritional information integration\n- Offline functionality for saved recipes\n\nThe application uses Progressive Web App (PWA) technology to provide a native app-like experience while remaining accessible through web browsers. The backend API was designed to handle high loads and provide real-time updates for social interactions.",
    technologies: ["React", "PWA", "Firebase", "Cloud Functions", "Material-UI", "Workbox"],
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=600&fit=crop"
    ],
    liveUrl: "https://recipeshare.kyleo.co.uk",
    githubUrl: "https://github.com/kyleo/recipe-sharing-app",
    category: "web-development",
    status: "published",
    featured: false,
    completedDate: "2023-09-10",
    createdAt: "2023-09-10T09:45:00.000Z",
    updatedAt: "2023-09-10T09:45:00.000Z",
    slug: "recipe-sharing-app"
  },
  {
    id: 4,
    title: "Portfolio Website Template",
    description: "A customizable portfolio website template for creative professionals with CMS integration.",
    longDescription: "This project was born from the need to provide creative professionals with an easy-to-use, customizable portfolio solution. The template was designed to be visually stunning while remaining highly functional and easy to customize.\n\nThe template includes:\n- Multiple layout options and color schemes\n- Integrated content management system\n- Project showcase with filtering\n- Blog functionality\n- Contact form with email integration\n- SEO optimization\n- Mobile-responsive design\n- Performance optimized\n\nBuilt with modern web technologies, the template is easy to deploy and customize. It includes comprehensive documentation and has been used by over 200 creative professionals worldwide.",
    technologies: ["React", "Gatsby", "GraphQL", "Styled Components", "Netlify CMS"],
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop"
    ],
    liveUrl: "https://portfolio-template.kyleo.co.uk",
    githubUrl: "https://github.com/kyleo/portfolio-template",
    category: "web-design",
    status: "published",
    featured: false,
    completedDate: "2023-07-30",
    createdAt: "2023-07-30T16:20:00.000Z",
    updatedAt: "2023-07-30T16:20:00.000Z",
    slug: "portfolio-website-template"
  },
  {
    id: 5,
    title: "Task Management Dashboard",
    description: "A comprehensive task management system with team collaboration features and real-time updates.",
    longDescription: "TaskFlow is a sophisticated task management application designed for teams and individuals who need to organize complex projects and collaborate effectively. The application provides a clean, intuitive interface that makes project management accessible to users of all technical levels.\n\nCore features:\n- Kanban-style task boards\n- Team collaboration and assignment\n- Real-time updates and notifications\n- Time tracking and reporting\n- File attachments and comments\n- Custom workflows and automation\n- Mobile-responsive design\n- Integration with popular tools (Slack, Google Drive)\n\nThe application was built with scalability in mind, using microservices architecture to ensure it can handle teams of any size. The real-time functionality is powered by WebSockets, providing instant updates across all connected clients.",
    technologies: ["Vue.js", "Node.js", "Socket.io", "PostgreSQL", "Redis", "Docker"],
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
    ],
    liveUrl: "https://taskflow.kyleo.co.uk",
    githubUrl: "https://github.com/kyleo/task-management",
    category: "web-development",
    status: "published",
    featured: true,
    completedDate: "2024-02-28",
    createdAt: "2024-02-28T11:00:00.000Z",
    updatedAt: "2024-02-28T11:00:00.000Z",
    slug: "task-management-dashboard"
  }
];

// Initialize projects in localStorage if they don't exist
const initializeProjects = () => {
  const existingProjects = localStorage.getItem('portfolioProjects');
  if (!existingProjects) {
    localStorage.setItem('portfolioProjects', JSON.stringify(defaultProjects));
    console.log('Portfolio projects initialized with default data');
  } else {
    console.log('Portfolio projects already exist in localStorage');
  }
};

// Initialize on module load
initializeProjects();

export { defaultProjects, initializeProjects };
export default defaultProjects;
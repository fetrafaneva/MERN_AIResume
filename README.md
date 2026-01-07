#  MERN_AIResume

This project is a full-stack web app that allows users to create, customize, and generate professional resumes using AI assistance, all in a clean and interactive interface. It uses MongoDB, Express, React, and Node.js.

## 📦 Tech Stack

### Frontend:

- `React.js`
- `JavaScript`
- `TypeScript`
- `TailwindCSS`
- `CSS`

### Backend:

- `Node.js`
- `Express.js`
- `MongoDB Atlas (with Mongoose)`

### AI & Services:

- `OpenAI API`

### Cloud & Services:

- `ImageKit (image upload & optimization)`


## 🦄 Features

Here's what you can do with MERN AI Resume:

- **Create a Resume**: Build a professional resume by filling in your personal information, skills, experience, and education.

- **AI-Powered Content**: Use AI to generate or improve resume descriptions, summaries, and job experiences.

- **Edit & Customize**: Easily update sections of your resume and customize the content to match your career goals.

- **Live Preview**: See real-time updates of your resume as you edit, ensuring instant feedback.

- **Image Upload**: Upload and manage profile images using ImageKit for fast and optimized image handling.

- **User Authentication**: Securely register and log in to access and manage your resumes.

- **Save & Manage Resumes**: Store your resumes in the database and access them anytime.

## 👩🏽‍🍳 The Process

I started by rendering a canvas with rough.js to create the base for all the drawings. Then, I focused on drawing on the canvas, allowing users to make lines, rectangles, and other shapes.

Next, I made sure users could move elements around. This was important for adjusting drawings. After that, I added the ability to resize elements to give more control over the shapes.

To make sure mistakes could be fixed, I implemented undo and redo features. I also added freehand drawing for a more natural sketching experience and a text tool to label or note on the canvas.

To navigate larger drawings, I put in pan and zoom tools. With everything functioning, I designed the whole UI to make it user-friendly and appealing.

Finally, I added testing with Cypress and Testing Library. I conducted end-to-end tests on drawing and manipulating text, lines, rectangles, and freehand drawings to make sure everything worked smoothly.

Along the way, while building everything, I took notes on what I've learned so I don't miss out on it. I also documented the behind-the-scenes processes every time a feature was added.

This way, I understood what I've built. The funny thing is, as soon as I started to document what happened behind the scenes and the features I've added, it made me realize that we fully understand something once we've actually taken a step back, thought about it, and documented what we've done. I think this is a good practice to follow when learning something new.

## 📚 What I Learned

During this project, I gained valuable technical skills and a deeper understanding of full-stack development concepts, which significantly improved my problem-solving and logical thinking abilities.

### Full-Stack MERN Architecture:

- **Application Structure**: I learned how to structure a MERN application by separating frontend and backend responsibilities while ensuring smooth communication between them.

- **API Design**: Designing RESTful APIs helped me understand how data flows between the client and server.

### Authentication & Security

- **User Authentication**: I implemented user registration and login using JWT, which taught me how to secure routes and protect user data.

- **Authorization Logic:**: I learned how to manage authenticated sessions and restrict access to user-specific resources.

### MongoDB & Mongoose:

- **Data Modeling**: Working with Mongoose improved my understanding of schema design, relationships, and data validation.

- **Cloud Databases**: Using MongoDB Atlas helped me learn how to manage a cloud-hosted database in a real-world project.

### AI Integration with OpenAI:

- **AI-Powered Features**: I learned how to integrate the OpenAI API to generate and improve resume content dynamically.

- **Prompt Design**: Writing effective prompts helped me understand how to get relevant and useful AI-generated results.

### Image Upload with ImageKit:

- **Cloud Media Handling**: I learned how to upload, store, and optimize images using ImageKit.

- **Performance Awareness**: This improved my understanding of image optimization and faster content delivery.

### 📈 Overall Growth:

Ehach part of tis project helped me understand more about building we apps, managing complex information, and improving user experience. It was more than just making a tool. It was about solving problems, learning new things, and improving my skills for future work.

## How can it be improved?

- Implement more AI templates
- Add responsive design improvements
- Add unit & integration tests

## Running the Project

To run the project in your local environment, follow these steps:

1. Clone the repo `git clone https://github.com/fetrafaneva/MERN_AIResume.git`
2. Install dependencies:
   ### Frontend:
       `cd client`
       `npm install`
       `npm run dev`
   
   ### Backend:
       `cd server`
       `npm install`
       `npm run server`        

3. Environment variables:

Create .env file with your keys:
   ### Frontend:
        VITE_BASE_URL = "Your back server Link ex: http://localhost:3000"

   ### Backend:
        JWT_SECRET = "any_random_secret"
        
        MONGODB_URI = "Your_MongoDBURI"
        
        IMAGEKIT_PRIVATE_KEY = "Your_ImageKit_key"
        
        OPENAI_API_KEY = "Your_openai_Api_Key"
        
        OPENAI_BASE_URL = "Your_Openai_Base_Url"
        
        OPENAI_MODEL = "Your_Openai_Model"

## 🍿 Video

https://github.com/

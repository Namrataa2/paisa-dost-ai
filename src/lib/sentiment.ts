@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 40% 98%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --muted: 220 30% 96%;
    --muted-foreground: 220 10% 45%;
    --border: 220 25% 90%;
    --input: 220 25% 90%;
    --sidebar-background: 210 40% 99%;
    --sidebar-foreground: 220 25% 25%;
    --ring: 245 82% 63%;
    --radius: 1rem;
  }

  .dark {
    --background: 222 30% 8%;
    --foreground: 210 40% 98%;
    --card: 222 27% 12%;
    --card-foreground: 210 40% 98%;
    --muted: 220 25% 18%;
    --muted-foreground: 220 15% 72%;
    --border: 220 20% 20%;
    --input: 220 20% 20%;
    --sidebar-background: 222 28% 10%;
    --sidebar-foreground: 220 25% 85%;
    --ring: 245 82% 63%;
  }

  * {
    @apply border-border;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply min-h-screen bg-background text-foreground antialiased;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }
}

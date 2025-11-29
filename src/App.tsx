import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Timeline } from "@/components/ui/timeline"
import { CONFIG } from "@/config"
import { fetchGitHubProjects, type GitHubRepo } from "@/lib/github"
import { fetchSheetData, type SheetData, cleanLink } from "@/lib/sheets"
import { Github, Link as LinkIcon, MapPin, Phone, Instagram, Globe, MessageCircle, Mail, Linkedin, X } from "lucide-react"
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

// Fallback data in case sheet fetch fails or is not configured
const FALLBACK_DATA: SheetData[] = [
  {
    section: "Bio",
    title: "Welcome",
    description: "I am a developer building cool things. Configure your Google Sheet to update this text!",
    image: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=3270&auto=format&fit=crop"]
  }
]

function App() {
  const [sheetData, setSheetData] = useState<SheetData[]>([])
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)

  const [cursorText, setCursorText] = useState<string | React.ReactNode>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  useEffect(() => {
    async function loadData() {
      setLoading(true)

      // Load Sheets Data
      try {
        const data = await fetchSheetData(CONFIG.GOOGLE_SHEET_URL)
        if (data.length > 0) {
          setSheetData(data)
        } else {
          // Sheet is connected but empty
          setSheetData([{
            section: "Bio",
            title: "Setup Required",
            description: "Successfully connected to Google Sheets! But the sheet is empty. Please add rows with 'Bio', 'Timeline', or 'Social' in the Section column.",
          }])
        }
      } catch (e) {
        console.error("Failed to load sheet data", e)
        setSheetData(FALLBACK_DATA)
      }

      // Load GitHub Data
      if (CONFIG.GITHUB_USERNAME && CONFIG.GITHUB_USERNAME !== "your-username") {
        try {
          const repoData = await fetchGitHubProjects(CONFIG.GITHUB_USERNAME)
          // Shuffle and take top 10
          const shuffled = repoData.sort(() => 0.5 - Math.random());
          setRepos(shuffled.slice(0, 10));
        } catch (e) {
          console.error("Failed to load GitHub data", e)
        }
      }

      setLoading(false)
    }

    loadData()
  }, [])

  // Extract Header/Hero section if it exists
  const headerData = sheetData.find(item => item.section.toLowerCase() === "header" || item.section.toLowerCase() === "hero");

  // Group data by section to create timeline entries (excluding Header)
  const sections = sheetData
    .filter(item => item.section.toLowerCase() !== "header" && item.section.toLowerCase() !== "hero")
    .reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    }, {} as Record<string, SheetData[]>);

  // Preserve order of sections as they appear in the sheet
  const sectionOrder = Array.from(new Set(
    sheetData
      .filter(item => item.section.toLowerCase() !== "header" && item.section.toLowerCase() !== "hero")
      .map(item => item.section)
  ));

  // Prepare Tooltip Data
  const tooltipData = sheetData
    .filter(item => item.section.toLowerCase() === "tooltip" || item.section.toLowerCase() === "team")
    .map((item, idx) => ({
      id: idx,
      name: item.title,
      designation: item.description,
      image: item.image ? item.image[0] : "",
    }));

  // Fallback for Tooltip if empty
  if (tooltipData.length === 0) {
    const bio = sheetData.find(item => item.section === "Bio");
    if (bio && bio.image && bio.image.length > 0) {
      tooltipData.push({
        id: 1,
        name: bio.title,
        designation: "Developer",
        image: bio.image[0]
      });
    }
  }

  const handleContextMenu = async (e: React.MouseEvent) => {
    // Allow default context menu for links and images
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.tagName === 'IMG') {
      return;
    }

    e.preventDefault();
    const selection = window.getSelection()?.toString();
    if (selection) {
      setCursorText("Searching...");
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selection)}`);
        const data = await response.json();
        if (data.extract) {
          setCursorText(
            <div className="max-w-xs text-xs">
              <p className="line-clamp-3">{data.extract}</p>
            </div>
          );
        } else {
          setCursorText("No definition found");
        }
      } catch (error) {
        setCursorText("Error fetching definition");
      }
    }
  };

  // Reset cursor text when clicking elsewhere
  useEffect(() => {
    const handleClick = () => {
      if (typeof cursorText !== 'string' || (cursorText !== "" && !cursorText.includes("Ranbir"))) {
        setCursorText("");
      }
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [cursorText]);


  const timelineEntries = [
    ...sectionOrder.map(sectionName => ({
      title: sectionName,
      content: (
        <div
          className="flex flex-col gap-8"
          onMouseEnter={() => setCursorText(sectionName)}
          onMouseLeave={() => setCursorText("")}
        >
          {sections[sectionName].map((item, idx) => (
            <div key={idx}>
              <h4 className="text-lg font-bold mb-2 text-neutral-900 dark:text-neutral-100">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                  {item.description}
                </p>
              )}
              {item.link && item.link.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.link.map((link, idx) => (
                    <a
                      key={idx}
                      href={cleanLink(link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-medium text-neutral-900 dark:text-neutral-100"
                      onContextMenu={(e) => handleContextMenu(e)}
                      onMouseEnter={() => setCursorText(link)}
                      onMouseLeave={() => setCursorText("")}
                    >
                      <LinkIcon className="w-4 h-4" />
                      Visit Link {item.link && item.link.length > 1 ? idx + 1 : ""}
                    </a>
                  ))}
                </div>
              )}
              {item.image && item.image.length > 0 && (
                <div className={`grid gap-4 mt-4 ${item.image.length === 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                  {item.image.map((imgSrc, imgIdx) => (
                    <img
                      key={imgIdx}
                      src={imgSrc}
                      alt={`${item.title} ${imgIdx + 1}`}
                      className="rounded-lg w-full h-auto shadow-lg cursor-zoom-in"
                      referrerPolicy="no-referrer"
                      onClick={() => setSelectedImage(imgSrc)}
                      onMouseEnter={() => setCursorText("View Image")}
                      onMouseLeave={() => setCursorText("")}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    })),

    // GitHub Projects (Always at the end)
    {
      title: "Projects",
      content: (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onMouseEnter={() => setCursorText("Projects")}
          onMouseLeave={() => setCursorText("")}
        >
          {repos.length === 0 && CONFIG.GITHUB_USERNAME === "your-username" && (
            <p className="text-sm text-neutral-500">Configure GITHUB_USERNAME in src/config.ts to see projects.</p>
          )}
          {repos.map(repo => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
              onMouseEnter={() => setCursorText(repo.html_url)}
              onMouseLeave={() => setCursorText("")}
            >
              <CardSpotlight className="h-full flex flex-col justify-between p-6 hover:shadow-xl transition-shadow bg-neutral-50 dark:bg-black border-neutral-200 dark:border-neutral-800">
                <div>
                  <div className="flex justify-between items-start mb-2 relative z-20">
                    <h4 className="font-bold text-lg truncate pr-2 text-neutral-900 dark:text-neutral-100">{repo.name}</h4>
                    <Github className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2 h-10 relative z-20">
                    {repo.description || "No description available."}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap relative z-20">
                  {repo.language && (
                    <span className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded text-neutral-800 dark:text-neutral-200">{repo.language}</span>
                  )}
                  {repo.topics?.slice(0, 2).map(topic => (
                    <span key={topic} className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded text-neutral-800 dark:text-neutral-200">{topic}</span>
                  ))}
                </div>
              </CardSpotlight>
            </a>
          ))}
        </div>
      )
    }
  ]

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className="min-h-screen bg-white dark:bg-black transition-colors duration-300"
        onContextMenu={handleContextMenu}
      >
        <div className="fixed top-4 right-4 z-50">
          <ModeToggle />
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : (
          <FollowerPointerCard
            title={
              cursorText ? (
                typeof cursorText === 'string' ? (
                  <span className="font-bold text-sm">{cursorText}</span>
                ) : cursorText
              ) : (
                <span className="font-bold text-sm">{headerData?.title || "Ranbir Khurana"}</span>
              )
            }
            className="w-full"
          >
            <Timeline
              data={timelineEntries}
              header={headerData ? {
                title: headerData.title,
                description: headerData.description,
                image: headerData.image ? headerData.image[0] : undefined
              } : undefined}
              socialLinks={[
                { icon: MapPin, text: "Khanna", href: "https://www.google.com/maps/place/Khanna,+Punjab" },
                { icon: Mail, text: "RanbirKhurana195@gmail.com", href: "mailto:RanbirKhurana195@gmail.com" },
                { icon: Phone, text: "+91 9041107458", href: "tel:+919041107458" },
                { icon: Instagram, text: "r.kingkhurana", href: "https://instagram.com/r.kingkhurana" },
                { icon: Linkedin, text: "in/ranbir-khurana-devranbir", href: "https://linkedin.com/in/ranbir-khurana-devranbir" },
                { icon: Globe, text: "Devfolio", href: "https://devfolio.co/@DevRanbir" },
                { icon: MessageCircle, text: "Discord", href: "https://discord.gg/pqdHTChM" },
              ]}
              onLinkHover={(text) => setCursorText(text || "")}
            />

            {tooltipData.length > 0 && (
              <div className="flex flex-row items-center justify-center py-10 w-full">
                <AnimatedTooltip items={tooltipData} />
              </div>
            )}
          </FollowerPointerCard>
        )}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 left-1/2 -translate-x-1/2 p-3 bg-white text-black hover:bg-neutral-200 rounded-full shadow-lg transition-colors z-50"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={selectedImage}
                alt="Full screen preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}

// Helper to map string types to Lucide icons


export default App

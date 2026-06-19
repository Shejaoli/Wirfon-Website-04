import type { GalleryAlbum } from "./site";

import img1 from "@assets/IMG_20230625_132855_776_1777412731016.jpg";
import img2 from "@assets/IMG_20230625_133031_342_1777412731017.jpg";
import img3 from "@assets/letsrule2021-09-01_14-54-16_1777412731017.jpg";
import img4 from "@assets/Members29_00-08-33_1777412731018.jpg";
import img5 from "@assets/Photo_from_Mfoome_Bahti_-Ban(1)_1777412731018.jpg";
import img6 from "@assets/Photo_from_Mfoome_Bahti_-Ban(2)_1777412731019.jpg";
import img7 from "@assets/Photo_from_Mfoome_Bahti_-Ban(3)_1777412731019.jpg";
import img8 from "@assets/Photo_from_Mfoome_Bahti_-Ban(4)_1777412731020.jpg";
import img9 from "@assets/Photo_from_Mfoome_Bahti_-Ban(5)_1777412731021.jpg";
import img10 from "@assets/Photo_from_Mfoome_Bahti_-Ban(6)_1777412731021.jpg";
import img11 from "@assets/Photo_from_Mfoome_Bahti_-Ban(7)_1777412731022.jpg";
import img12 from "@assets/Photo_from_Mfoome_Bahti_-Ban(8)_1777412731022.jpg";
import img13 from "@assets/Photo_from_Mfoome_Bahti_-Ban(9)_1777412731023.jpg";
import img14 from "@assets/Photo_from_Mfoome_Bahti_-Ban(10)_1777412731023.jpg";
import img15 from "@assets/Photo_from_Mfoome_Bahti_-Ban_1777412731024.jpg";

export const STATIC_ALBUMS: GalleryAlbum[] = [
  {
    id: "summit-2023",
    title: "WirfonCloud Summit — Brussels 2023",
    dateLabel: "June 2023",
    cover: img1,
    photos: [
      { src: img1, alt: "Group photo of WirfonCloud Summit attendees", caption: "Brussels Summit — Group Photo" },
      { src: img2, alt: "WirfonCloud branded session", caption: "Hands-on with the cloud" },
    ],
  },
  {
    id: "summit-2021",
    title: "Wirfon Cloud Summit — Brussels 2021",
    dateLabel: "September 2021",
    cover: img3,
    photos: [
      { src: img3, alt: "WirfonCloud — Let's rule the clouds banner", caption: "Let's rule the clouds" },
      { src: img4, alt: "WirfonCloud Summit attendees", caption: "Community in person" },
      { src: img5, alt: "Speaker addressing attendees", caption: "Keynote moments" },
      { src: img6, alt: "Attendees in a working session", caption: "Hands-on workshop" },
      { src: img7, alt: "Speaker pointing at WirfonCloud banner", caption: "The future is bright" },
      { src: img8, alt: "Summit room before sessions", caption: "Ready for the Summit" },
      { src: img9, alt: "Interactive session with whiteboard", caption: "Interactive learning" },
      { src: img10, alt: "Classroom view of the Summit", caption: "Full house in Brussels" },
      { src: img11, alt: "Attendee at Wirfon Cloud Summit Brussels 2021", caption: "Wirfon Cloud Summit — Brussels 2021" },
      { src: img12, alt: "Attendee taking notes", caption: "Sharing knowledge" },
      { src: img13, alt: "Working session at the Summit", caption: "Collaborating in person" },
      { src: img14, alt: "Attendees networking", caption: "Networking & community" },
      { src: img15, alt: "Conversations between sessions", caption: "Building lasting connections" },
    ],
  },
];

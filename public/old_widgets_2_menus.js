;(() => {
  // Prevent multiple initializations
  if (window.AIChatbot && window.AIChatbot.initialized) {
    return
  }

  const LOGO_URL =
    "http://nwcmc.sparrowsoftech.in/web/upload_files/website/img/logo/weblogo6364d3f0f495b6ab9dcf8d3b5c6e0b01.png"

  const AIChatbot = {
    initialized: false,
    config: null,
    isOpen: false,
    messages: [], // Stores the entire chat history (text and buttons)
    currentLanguage: null, // 'english' or 'marathi'
    currentMenuLevel: "language_select", // 'language_select', 'main_menu', 'submenu', 'free_text'
    currentMenuContext: null, // Stores the selected main menu for submenu display

    // Define the menu structure directly in the widget for simplicity
    MENU_STRUCTURE: {
      english: {
        welcome: "Hi, Welcome to Nanded Municipal Corporation, How can I help you?",
        other_option: "Other (Ask a question)",
        menus: [
          {
            label: "Applied List",
            query: "Applied List",
            submenus: [{ label: "All Application List", query: "All Application List" }],
          },
          {
            label: "Property",
            query: "Property",
            submenus: [
              { label: "New Assessment of Property tax", query: "New Assessment of Property tax" },
              { label: "Re-Assessment of Property tax", query: "Re-Assessment of Property tax" },
              {
                label: "Tax Assessment - Demolition & Reconstruct",
                query: "Tax Assessment - Demolition & Reconstruct",
              },
              { label: "Name Transfer - By Valid Documents", query: "Name Transfer - By Valid Documents" },
              { label: "Name Transfer - By Heirship", query: "Name Transfer - By Heirship" },
              { label: "Name Transfer - By Other Way", query: "Name Transfer - By Other Way" },
              { label: "Name Transfer - By Property Division", query: "Name Transfer - By Property Division" },
              { label: "Tax Exemption for Property tax", query: "Tax Exemption for Property tax" },
              { label: "Tax Exemption - Unoccupied", query: "Tax Exemption - Unoccupied" },
              { label: "Raising Tax Objection", query: "Raising Tax Objection" },
              { label: "Self Assessment of Property tax", query: "Self Assessment of Property tax" },
              { label: "Demand Bill of Property tax", query: "Demand Bill of Property tax" },
              { label: "No Dues Certificate - Property Tax", query: "No Dues Certificate - Property Tax" },
              { label: "Pay Your Property Tax", query: "Pay Your Property Tax" },
              { label: "Extract of Property Tax Ledger", query: "Extract of Property Tax Ledger" },
            ],
          },
          {
            label: "Water",
            query: "Water",
            submenus: [
              { label: "New Water Connection", query: "New Water Connection" },
              { label: "No Dues Certificate - Water Charges", query: "No Dues Certificate - Water Charges" },
              { label: "Demand Bill for Water Usage", query: "Demand Bill for Water Usage" },
              { label: "Water Connection Certificate", query: "Water Connection Certificate" },
              { label: "Complaint for Faulty Meter", query: "Complaint for Faulty Meter" },
              { label: "Complaint for Water Pressure", query: "Complaint for Water Pressure" },
              { label: "Complaint for Water Quality", query: "Complaint for Water Quality" },
              { label: "Complaint for Illegal Connection", query: "Complaint for Illegal Connection" },
              { label: "Ownership Change of Water Connection", query: "Ownership Change of Water Connection" },
              { label: "Change in Tap Size", query: "Change in Tap Size" },
              { label: "Disconnection of Water Connection", query: "Disconnection of Water Connection" },
              { label: "Change in Water Usage Category", query: "Change in Water Usage Category" },
              { label: "Re-Connection of Water Connection", query: "Re-Connection of Water Connection" },
              { label: "Plumber License - New", query: "Plumber License - New" },
              { label: "Renewal of Plumber License", query: "Renewal of Plumber License" },
            ],
          },
          {
            label: "No Objection Certificate",
            query: "No Objection Certificate",
            submenus: [
              { label: "NOC for Fire (Provisional)", query: "NOC for Fire (Provisional)" },
              { label: "NOC for Fire - Final", query: "NOC for Fire - Final" },
              { label: "NOC for Fire - Final New", query: "NOC for Fire - Final New" },
              { label: "NOC for Fire - Renewal", query: "NOC for Fire - Renewal" },
              { label: "NOC for Godown/Store/Trade", query: "NOC for Godown/Store/Trade" },
              { label: "NOC for Pendol", query: "NOC for Pendol" },
            ],
          },
          {
            label: "Health",
            query: "Health",
            submenus: [
              { label: "Nursing Home Registration - New", query: "Nursing Home Registration - New" },
              { label: "Nursing Home Registration - Renewal", query: "Nursing Home Registration - Renewal" },
              { label: "Nursing Home Regi. - Ownership Change", query: "Nursing Home Regi. - Ownership Change" },
              { label: "Maintenance of Cleanliness in City", query: "Maintenance of Cleanliness in City" },
            ],
          },
          {
            label: "Birth, Death & Marriage",
            query: "Birth, Death & Marriage",
            submenus: [
              { label: "Birth Certificate", query: "Birth Certificate" },
              { label: "Death Certificate", query: "Death Certificate" },
              { label: "Marriage Certificate", query: "Marriage Certificate" },
            ],
          },
          {
            label: "Advertisement & Movie Shooting",
            query: "Advertisement & Movie Shooting",
            submenus: [
              { label: "Hoarding & Sinage License", query: "Hoarding & Sinage License" },
              { label: "Movies Shooting License", query: "Movies Shooting License" },
            ],
          },
          {
            label: "Garden",
            query: "Garden",
            submenus: [{ label: "Permission for Tree Cutting", query: "Permission for Tree Cutting" }],
          },
          {
            label: "Town Planning",
            query: "Town Planning",
            submenus: [
              { label: "Area Map", query: "Area Map" },
              { label: "Zone Certificate", query: "Zone Certificate" },
              { label: "Building Permission", query: "Building Permission" },
              { label: "Plinth Certificate", query: "Plinth Certificate" },
              { label: "Occupancy Certificate", query: "Occupancy Certificate" },
            ],
          },
          {
            label: "Trade License",
            query: "Trade License",
            submenus: [
              { label: "New Trade License", query: "New Trade License" },
              { label: "Renewal of Trade Licence", query: "Renewal of Trade Licence" },
              { label: "Transfer of Trade Licence Ownership", query: "Transfer of Trade Licence Ownership" },
              { label: "Change in the Firm Name", query: "Change in the Firm Name" },
              { label: "Change in the Trade Category", query: "Change in the Trade Category" },
              { label: "Change in the Partner's Name", query: "Change in the Partner's Name" },
              { label: "Addition/Removal of Partner", query: "Addition/Removal of Partner" },
              { label: "Cancellation of Trade License", query: "Cancellation of Trade License" },
              { label: "Duplicate copy of Trade Licence", query: "Duplicate copy of Trade Licence" },
              { label: "Auto Renewal of Trade Licence", query: "Auto Renewal of Trade Licence" },
              { label: "Notice For Expired Trade Licence", query: "Notice For Expired Trade Licence" },
              { label: "Hawker Registration", query: "Hawker Registration" },
              { label: "Lodging House - New Licence", query: "Lodging House - New Licence" },
              { label: "Lodging House - Renewal of Licence", query: "Lodging House - Renewal of Licence" },
              { label: "Function Hall - New Licence", query: "Function Hall - New Licence" },
              { label: "Function Hall - Renewal of Licence", query: "Function Hall - Renewal of Licence" },
            ],
          },
          {
            label: "PWD",
            query: "PWD",
            submenus: [{ label: "To Fill Pot Holes in Road", query: "To Fill Pot Holes in Road" }],
          },
          {
            label: "Sewer",
            query: "Sewer",
            submenus: [
              { label: "New Drainage Connection", query: "New Drainage Connection" },
              { label: "Maintenance of Gutter /Manhole Cover", query: "Maintenance of Gutter /Manhole Cover" },
            ],
          },
        ],
      },
      marathi: {
        welcome: "नमस्कार, नांदेड महानगरपालिकेत आपले स्वागत आहे, आपण मला कसे सहाय्य करू शकतो?",
        other_option: "इतर (प्रश्न विचारा)",
        menus: [
          {
            label: "अर्ज केलेली यादी", // Applied List
            query: "Applied List",
            submenus: [
              { label: "अर्ज यादी", query: "All Application List" }, // Application List
            ],
          },
          {
            label: "मालमत्ता", // Property
            query: "Property",
            submenus: [
              { label: "नवीन मालमत्ता कर मूल्यांकन", query: "New Assessment of Property tax" },
              { label: "मालमत्ता कर पुनर्मूल्यांकन", query: "Re-Assessment of Property tax" },
              { label: "कर मूल्यांकन - पाडणे आणि पुनर्रचना", query: "Tax Assessment - Demolition & Reconstruct" },
              { label: "दस्तऐवजांवर आधारित नाव बदला", query: "Name Transfer - By Valid Documents" },
              { label: "वारसाहक्कावर आधारित नाव बदला", query: "Name Transfer - By Heirship" },
              { label: "इतर मार्गाने नाव बदला", query: "Name Transfer - By Other Way" },
              { label: "मालमत्ता विभागणीने नाव बदला", query: "Name Transfer - By Property Division" },
              { label: "मालमत्ता करासाठी कर सवलत", query: "Tax Exemption for Property tax" },
              { label: "अवास्तव मालमत्तेसाठी कर सवलत", query: "Tax Exemption - Unoccupied" },
              { label: "कर आक्षेप नोंदवा", query: "Raising Tax Objection" },
              { label: "स्वयं मूल्यांकन मालमत्ता कर", query: "Self Assessment of Property tax" },
              { label: "मालमत्ता कर मागणी बिल", query: "Demand Bill of Property tax" },
              { label: "नो ड्यूस प्रमाणपत्र - मालमत्ता कर", query: "No Dues Certificate - Property Tax" },
              { label: "आपला मालमत्ता कर भरा", query: "Pay Your Property Tax" },
              { label: "मालमत्ता कर लेजर उतारा", query: "Extract of Property Tax Ledger" },
            ],
          },
          {
            label: "पाणी", // Water
            query: "Water",
            submenus: [
              { label: "नवीन पाणी कनेक्शन", query: "New Water Connection" },
              { label: "पाणी शुल्क थकबाकी प्रमाणपत्र", query: "No Dues Certificate - Water Charges" },
              { label: "पाणी वापरासाठी मागणी बिल", query: "Demand Bill for Water Usage" },
              { label: "पाणी कनेक्शन प्रमाणपत्र", query: "Water Connection Certificate" },
              { label: "दोषी मीटरसाठी तक्रार", query: "Complaint for Faulty Meter" },
              { label: "पाणी दाबाबद्दल तक्रार", query: "Complaint for Water Pressure" },
              { label: "पाण्याच्या गुणवत्तेबद्दल तक्रार", query: "Complaint for Water Quality" },
              { label: "बेकायदेशीर कनेक्शनसाठी तक्रार", query: "Complaint for Illegal Connection" },
              { label: "पाणी कनेक्शनचा मालकी हक्क बदला", query: "Ownership Change of Water Connection" },
              { label: "टॅप आकारात बदल", query: "Change in Tap Size" },
              { label: "पाणी कनेक्शनचे डिसकनेक्शन", query: "Disconnection of Water Connection" },
              { label: "पाणी वापर श्रेणीत बदल", query: "Change in Water Usage Category" },
              { label: "पाणी कनेक्शन पुन्हा जोडा", query: "Re-Connection of Water Connection" },
              { label: "प्लंबर लायसन्स - नवीन", query: "Plumber License - New" },
              { label: "प्लंबर लायसन्स - नूतनीकरण", query: "Renewal of Plumber License" },
            ],
          },
          {
            label: "फायर एनओसी", // Fire NOC
            query: "Fire NOC",
            submenus: [
              { label: "फायर एनओसी (तात्पुरती)", query: "NOC for Fire (Provisional)" },
              { label: "फायर एनओसी - अंतिम", query: "NOC for Fire - Final" },
              { label: "फायर एनओसी - अंतिम नवीन", query: "NOC for Fire - Final New" },
              { label: "फायर एनओसी - नूतनीकरण", query: "NOC for Fire - Renewal" },
              { label: "गोडाऊन/स्टोअर/व्यापारासाठी एनओसी", query: "NOC for Godown/Store/Trade" },
              { label: "पंडालसाठी एनओसी", query: "NOC for Pendol" },
            ],
          },
          {
            label: "आरोग्य", // Health
            query: "Health",
            submenus: [
              { label: "नर्सिंग होम नोंदणी - नवीन", query: "Nursing Home Registration - New" },
              { label: "नर्सिंग होम नोंदणी - नूतनीकरण", query: "Nursing Home Registration - Renewal" },
              { label: "नर्सिंग होम नोंदणी - मालकी बदल", query: "Nursing Home Regi. - Ownership Change" },
              { label: "शहरात स्वच्छतेचे देखभाल", query: "Maintenance of Cleanliness in City" },
            ],
          },
          {
            label: "जन्म, मृत्यू व विवाह", // Birth, Death & Marriage
            query: "Birth, Death & Marriage",
            submenus: [
              { label: "जन्म प्रमाणपत्र", query: "Birth Certificate" },
              { label: "मृत्यू प्रमाणपत्र", query: "Death Certificate" },
              { label: "विवाह प्रमाणपत्र", query: "Marriage Certificate" },
            ],
          },
          {
            label: "जाहिरात व चित्रपट चित्रीकरण", // Advertisement & Movie Shooting
            query: "Advertisement & Movie Shooting",
            submenus: [
              { label: "फलक व साइनज परवाना", query: "Hoarding & Sinage License" },
              { label: "चित्रपट चित्रीकरण परवाना", query: "Movies Shooting License" },
            ],
          },
          {
            label: "उद्यान", // Garden
            query: "Garden",
            submenus: [{ label: "झाड तोडण्याची परवानगी", query: "Permission for Tree Cutting" }],
          },
          {
            label: "नगर रचना", // Town Planning
            query: "Town Planning",
            submenus: [
              { label: "क्षेत्र नकाशा", query: "Area Map" },
              { label: "झोन प्रमाणपत्र", query: "Zone Certificate" },
              { label: "बांधकाम परवानगी", query: "Building Permission" },
              { label: "प्लिंथ प्रमाणपत्र", query: "Plinth Certificate" },
              { label: "ऑक्युपंसी प्रमाणपत्र", query: "Occupancy Certificate" },
            ],
          },
          {
            label: "व्यवसाय परवाना", // Trade License
            query: "Trade License",
            submenus: [
              { label: "नवीन व्यवसाय परवाना", query: "New Trade License" },
              { label: "व्यवसाय परवाना नूतनीकरण", query: "Renewal of Trade Licence" },
              { label: "व्यवसाय परवाना मालकी हक्क बदल", query: "Transfer of Trade Licence Ownership" },
              { label: "फर्म नावात बदल", query: "Change in the Firm Name" },
              { label: "व्यवसाय श्रेणीत बदल", query: "Change in the Trade Category" },
              { label: "भागीदाराच्या नावात बदल", query: "Change in the Partner's Name" },
              { label: "भागीदार समावेश/वगळा", query: "Addition/Removal of Partner" },
              { label: "व्यवसाय परवाना रद्द", query: "Cancellation of Trade License" },
              { label: "परवान्याची डुप्लिकेट प्रत", query: "Duplicate copy of Trade Licence" },
              { label: "परवाना आपोआप नूतनीकरण", query: "Auto Renewal of Trade Licence" },
              { label: "कालबाह्य परवान्यासाठी सूचना", query: "Notice For Expired Trade Licence" },
              { label: "हॉकर्स नोंदणी", query: "Hawker Registration" },
              { label: "लॉजिंग हाऊस - नवीन परवाना", query: "Lodging House - New Licence" },
              { label: "लॉजिंग हाऊस - परवाना नूतनीकरण", query: "Lodging House - Renewal of Licence" },
              { label: "फंक्शन हॉल - नवीन परवाना", query: "Function Hall - New Licence" },
              { label: "फंक्शन हॉल - परवाना नूतनीकरण", query: "Function Hall - Renewal of Licence" },
            ],
          },
          {
            label: "सार्वजनिक बांधकाम विभाग", // PWD
            query: "PWD",
            submenus: [{ label: "रस्त्यातील खड्डे भरणे", query: "To Fill Pot Holes in Road" }],
          },
          {
            label: "मलनिस्सारण", // Sewer
            query: "Sewer",
            submenus: [
              { label: "नवीन ड्रेनेज कनेक्शन", query: "New Drainage Connection" },
              { label: "गटर / मॅनहोल कव्हरची देखभाल", query: "Maintenance of Gutter /Manhole Cover" },
            ],
          },
        ],
      },
    },

    init: function (config) {
      if (this.initialized) return

      this.config = config
      this.initialized = true
      this.createWidget()
      this.attachEventListeners()
      this.resetChat() // Start with welcome message and language selection
    },

    createWidget: function () {
      // Create widget container
      const widgetContainer = document.createElement("div")
      widgetContainer.id = "ai-chatbot-widget"
      widgetContainer.innerHTML = `
        <style>
          #ai-chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            font-family: ${this.config.theme.fontFamily};
          }
          
          #ai-chatbot-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #2a3864;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          
          #ai-chatbot-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          }
          
          #ai-chatbot-button svg {
            width: 24px;
            height: 24px;
            fill: white;
          }
          
          #ai-chatbot-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            display: none;
            flex-direction: column;
            overflow: hidden;
          }
          
          #ai-chatbot-header {
            background: #2a3864;
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          #ai-chatbot-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            display: flex; /* Added for logo alignment */
            align-items: center; /* Added for logo alignment */
            gap: 8px; /* Added for spacing between logo and text */
          }

          .ai-chatbot-header-logo {
            height: 24px; /* Adjust as needed */
            width: auto;
          }
          
          #ai-chatbot-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 20px;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          #ai-chatbot-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .ai-chatbot-message {
            max-width: 80%;
            padding: 8px 12px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
          }
          
          .ai-chatbot-message.user {
            background: #2a3864;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            font-size: 13px
          }
          
          .ai-chatbot-message.bot {
            background: #f1f5f9;
            color: #334155;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            font-size: 13px
          }
          
          .ai-chatbot-message.typing {
            background: #f1f5f9;
            color: #64748b;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            display: flex; /* Added for logo alignment */
            align-items: center; /* Added for logo alignment */
            gap: 8px; /* Added for spacing between logo and text */
          }

          .ai-chatbot-typing-logo {
            height: 20px; /* Adjust as needed */
            width: auto;
          }

          // .ai-chatbot-welcome-logo-container {
          //   display: flex;
          //   justify-content: center;
          //   align-items: center;
            
          //   flex-grow: 1; /* Allows it to take available space */
          // }
          .ai-chatbot-welcome-logo-container
            {

                display: block;
                min-height: 130px;
                margin: auto;
            }


          // .ai-chatbot-welcome-logo {
          //   max-width: 60%; /* Adjust size as needed */
          //   max-height: 60%;
          //   object-fit: contain;
          // }
          .ai-chatbot-welcome-logo {
            object-fit: contain;
            max-height: 100%;

        }
          
          #ai-chatbot-input-container {
            padding: 16px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 8px;
          }
          
          #ai-chatbot-input {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 13px;
            outline: none;
            resize: none;
            font-family: inherit;
            height:20px;
            scrollbar-width: none;
          }
          
          #ai-chatbot-input:focus {
            border-color: ${this.config.theme.primaryColor};
          }
          
          #ai-chatbot-send {
            background: #2a3864;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
          }
          
          #ai-chatbot-send:disabled {
            opacity: 0.8;
            cursor: not-allowed;
          }
          
          #ai-chatbot-send svg {
            width: 16px;
            height: 16px;
            fill: white;
          }

          .ai-chatbot-buttons-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 12px;
            width: 100%;
            align-items: flex-start; /* Align buttons to the left */
          }

          .ai-chatbot-button-option {
            background: #e2e8f0;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 10px 15px;
            font-size: 14px;
            cursor: pointer;
            text-align: left;
            width: 100%;
            transition: background 0.2s, border-color 0.2s;
          }

          .ai-chatbot-button-option:hover {
            background: #d1d5db;
            border-color: #94a3b8;
          }
          
          @media (max-width: 480px) {
            #ai-chatbot-window {
              width: calc(100vw - 40px);
              height: calc(100vh - 100px);
              bottom: 80px;
              right: 20px;
            }
          }
        </style>
        
        <button id="ai-chatbot-button" title="Open Chat">
          <svg viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </button>
        
        <div id="ai-chatbot-window">
          <div id="ai-chatbot-header">
            <h3><img src="${LOGO_URL}" alt="NWCMC Logo" class="ai-chatbot-header-logo" /> NWCMC Assistant</h3>
            <button id="ai-chatbot-close">&times;</button>
          </div>
          <div id="ai-chatbot-messages">
            </div>
          <div id="ai-chatbot-input-container">
            <textarea id="ai-chatbot-input" placeholder="Type your message..."></textarea>
            <button id="ai-chatbot-send" disabled>
              <svg viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      `

      document.body.appendChild(widgetContainer)
    },

    attachEventListeners: function () {
      const button = document.getElementById("ai-chatbot-button")
      const closeBtn = document.getElementById("ai-chatbot-close")
      const input = document.getElementById("ai-chatbot-input")
      const sendBtn = document.getElementById("ai-chatbot-send")

      button.addEventListener("click", () => this.toggleWidget())
      closeBtn.addEventListener("click", () => this.closeWidget())

      input.addEventListener("input", () => {
        sendBtn.disabled = !input.value.trim()
        this.autoResize(input)
      })

      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          this.sendMessage()
        }
      })

      sendBtn.addEventListener("click", () => this.sendMessage())
    },

    toggleWidget: function () {
      const windowElement = document.getElementById("ai-chatbot-window")
      if (this.isOpen) {
        this.closeWidget()
      } else {
        windowElement.style.display = "flex"
        this.isOpen = true
        this.renderMessages() // Render all stored messages
        document.getElementById("ai-chatbot-input").focus()
        this.updateInputState() // Ensure input state is correct on open
      }
    },

    closeWidget: function () {
      const windowElement = document.getElementById("ai-chatbot-window")
      windowElement.style.display = "none"
      this.isOpen = false
    },

    autoResize: (textarea) => {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px"
    },

    linkify: (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
      })
    },

    // Renders all messages from the this.messages array to the DOM
    renderMessages: function () {
      const messagesContainer = document.getElementById("ai-chatbot-messages")
      messagesContainer.innerHTML = "" // Clear current DOM messages before re-rendering

      this.messages.forEach((msg) => {
        if (msg.type === "text") {
          const messageDiv = document.createElement("div")
          messageDiv.classList.add("ai-chatbot-message", msg.isUser ? "user" : "bot")
          messageDiv.innerHTML = this.linkify(msg.content)
            .replace(/\n\n/g, "<br><br>")
            .replace(/\n/g, "<br>")
            .replace(/(?:^|\n)- (.*?)(?=\n|$)/g, "<br>&bull; $1")
          messagesContainer.appendChild(messageDiv)
        } else if (msg.type === "buttons") {
          this.appendButtonsToDOM(msg.buttons)
        } else if (msg.type === "welcome_logo") {
          const logoContainer = document.createElement("div")
          logoContainer.className = "ai-chatbot-welcome-logo-container"
          logoContainer.innerHTML = `<img src="${LOGO_URL}" alt="Welcome Logo" class="ai-chatbot-welcome-logo" />`
          messagesContainer.appendChild(logoContainer)
        }
      })
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    },

    // Adds a single message to the history and re-renders
    addMessageToHistory: function (content, isUser = false, type = "text") {
      this.messages.push({ type: type, content: content, isUser: isUser })
      if (this.isOpen) {
        // Only re-render if widget is open
        this.renderMessages()
      }
    },

    // Adds a set of buttons to the history and re-renders
    addButtonsToHistory: function (buttons) {
      this.messages.push({ type: "buttons", buttons: buttons })
      if (this.isOpen) {
        // Only re-render if widget is open
        this.renderMessages()
      }
    },

    // Appends buttons to the DOM (used by renderMessages)
    appendButtonsToDOM: function (buttons) {
      const messagesContainer = document.getElementById("ai-chatbot-messages")
      const buttonsContainer = document.createElement("div")
      buttonsContainer.className = "ai-chatbot-buttons-container"

      buttons.forEach((btn) => {
        const buttonElement = document.createElement("button")
        buttonElement.className = "ai-chatbot-button-option"
        buttonElement.textContent = btn.label
        buttonElement.dataset.action = btn.action // 'language', 'menu', 'submenu', 'other'
        buttonElement.dataset.value = btn.value // 'english', 'marathi', or query string
        buttonElement.dataset.menu = btn.menu || "" // For submenu context

        buttonElement.addEventListener("click", () => this.handleButtonClick(buttonElement))
        buttonsContainer.appendChild(buttonElement)
      })
      messagesContainer.appendChild(buttonsContainer)
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    },

    updateInputState: function () {
      const input = document.getElementById("ai-chatbot-input")
      const sendBtn = document.getElementById("ai-chatbot-send")
      if (this.currentMenuLevel === "free_text") {
        input.disabled = false
        sendBtn.disabled = !input.value.trim()
        input.focus()
      } else {
        input.disabled = true
        sendBtn.disabled = true
      }
    },

    resetChat: function () {
      this.messages = [] // Clear all history
      this.currentLanguage = null
      this.currentMenuLevel = "language_select"
      this.currentMenuContext = null

      // Add prominent logo
      this.addMessageToHistory(null, false, "welcome_logo")

      // Add welcome message
      this.addMessageToHistory(
        "Hi, Welcome to Nanded Municipal Corporation, How can I help you?\n\nनमस्कार, नांदेड महानगरपालिकेत आपले स्वागत आहे, आपण मला कसे सहाय्य करू शकतो?\nपुढे जाण्यासाठी, कृपया एखादी भाषा निवडा\nTo proceed, please select a language.",
      )
      // Add language selection buttons
      this.addButtonsToHistory([
        { label: "English", action: "language", value: "english" },
        { label: "Marathi", action: "language", value: "marathi" },
      ])
      this.updateInputState()
    },

    handleButtonClick: async function (buttonElement) {
      const action = buttonElement.dataset.action
      const value = buttonElement.dataset.value
      const menuContext = buttonElement.dataset.menu
      const label = buttonElement.textContent

      this.addMessageToHistory(label, true) // Show user's selection

      // Logic for handling button clicks
      if (action === "language") {
        this.currentLanguage = value
        this.currentMenuLevel = "main_menu"
        const welcomeMessage = this.MENU_STRUCTURE[this.currentLanguage].welcome
        this.addMessageToHistory(welcomeMessage)
        this.displayMainMenu()
      } else if (action === "menu") {
        this.currentMenuLevel = "submenu"
        this.currentMenuContext = this.MENU_STRUCTURE[this.currentLanguage].menus.find((m) => m.query === value)
        this.addMessageToHistory(
          this.currentLanguage === "marathi" ? "उप-श्रेणी निवडा:" : "Please choose a sub-category:",
        )
        this.displaySubMenu()
      } else if (action === "submenu") {
        this.currentMenuLevel = "free_text" // After selecting submenu, allow free text
        this.addMessageToHistory(
          this.currentLanguage === "marathi"
            ? "माहिती मिळवण्यासाठी कृपया प्रतीक्षा करा..."
            : "Please wait while I fetch the information...",
        )
        this.updateInputState()
        await this.sendMessage(value, true) // Send the submenu query to AI
      } else if (action === "other") {
        this.currentMenuLevel = "free_text"
        this.addMessageToHistory(
          this.currentLanguage === "marathi" ? "कृपया तुमचा प्रश्न टाइप करा." : "Please type your question.",
        )
        this.updateInputState()
      } else if (action === "back_to_main") {
        this.currentMenuLevel = "main_menu"
        this.currentMenuContext = null
        this.addMessageToHistory(this.currentLanguage === "marathi" ? "मुख्य मेनूवर परत." : "Back to main menu.")
        this.displayMainMenu()
      } else if (action === "start_over") {
        this.resetChat()
      }
    },

    displayMainMenu: function () {
      const currentLangConfig = this.MENU_STRUCTURE[this.currentLanguage]
      const buttons = currentLangConfig.menus.map((menu) => ({
        label: menu.label,
        action: "menu",
        value: menu.query,
      }))
      buttons.push({ label: currentLangConfig.other_option, action: "other", value: "other" })
      this.addButtonsToHistory(buttons)
      this.updateInputState()
    },

    displaySubMenu: function () {
      if (!this.currentMenuContext) return
      const currentLangConfig = this.MENU_STRUCTURE[this.currentLanguage]
      const buttons = this.currentMenuContext.submenus.map((submenu) => ({
        label: submenu.label,
        action: "submenu",
        value: submenu.query,
      }))
      buttons.push({ label: currentLangConfig.other_option, action: "other", value: "other" })
      buttons.push({
        label: this.currentLanguage === "marathi" ? "मागे" : "Back",
        action: "back_to_main",
        value: "back",
      })
      this.addButtonsToHistory(buttons)
      this.updateInputState()
    },

    sendMessage: async function (message = null, isMenuItem = false) {
      const input = document.getElementById("ai-chatbot-input")
      const sendBtn = document.getElementById("ai-chatbot-send")
      const messageToSend = message || input.value.trim()

      if (!messageToSend) return

      if (!isMenuItem) {
        // Only add user message to history if it's not a button click
        this.addMessageToHistory(messageToSend, true)
      }

      // Clear input and disable send button
      input.value = ""
      sendBtn.disabled = true
      this.autoResize(input)

      // Show typing indicator with logo
      const messagesContainer = document.getElementById("ai-chatbot-messages")
      const typingMessageDiv = document.createElement("div")
      typingMessageDiv.classList.add("ai-chatbot-message", "bot", "typing")
      typingMessageDiv.innerHTML = `<img src="${LOGO_URL}" alt="Typing" class="ai-chatbot-typing-logo" /> <span class="dot-flashing"></span> Bot is typing...`
      messagesContainer.appendChild(typingMessageDiv)
      messagesContainer.scrollTop = messagesContainer.scrollHeight

      try {
        const response = await fetch(this.config.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: messageToSend, language: this.currentLanguage }), // Pass language
        })

        const data = await response.json()

        // Remove typing indicator
        typingMessageDiv.remove()

        // Add bot response to history
        this.addMessageToHistory(data.response || "Sorry, I could not process your request.")

        // After AI response, offer to go back to main menu or start over
        this.addButtonsToHistory([
          {
            label: this.currentLanguage === "marathi" ? "पुन्हा सुरू करा" : "Start Over",
            action: "start_over",
            value: "start_over",
          },
          {
            label: this.currentLanguage === "marathi" ? "मुख्य मेनू" : "Main Menu",
            action: "back_to_main",
            value: "back_to_main",
          },
        ])
      } catch (error) {
        console.error("Chat error:", error)
        typingMessageDiv.remove()
        this.addMessageToHistory("Sorry, I'm having trouble connecting. Please try again.")
      } finally {
        this.updateInputState() // Re-enable input if free_text, or keep disabled if menu
      }
    },
  }

  // Expose to global scope
  window.AIChatbot = AIChatbot
})()

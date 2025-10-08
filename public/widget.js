/* global window, document, fetch */
;(() => {
  // Prevent multiple initializations
  if (window.AIChatbot && window.AIChatbot.initialized) {
    return
  }

  const LOGO_URL = "https://nwcmc.gov.in/web/upload_files/website/img/logo/weblogo6364d3f0f495b6ab9dcf8d3b5c6e0b01.png"

  const DIRECT_RTI_REPLY = `Go to this link - https://nwcmc.gov.in/web/others.php?uid=NDM1&id=ENG#gsc.tab=0

Various RTS Information available:
- Right to Information Act, 2005
- Right to Information Order
- Right to Information Order – 17/12/2015
- Right to Information Order – 07/07/2017
- Right to Information Order – 14/12/2017
- Right to Information Order – 23/08/2018
- Right to Information Order – 17/07/2019
- Right to Information Order – 13/10/2020
- Right to Information Order – 15/12/2020
- Right to Information Order – 16/09/2021
- Right to Information Order – 09/03/2023
- Information to be Proactively Disclosed under Section 4(1)(b) of the Right to Information Act, 2005 (Computer Department)
- Information to be Proactively Disclosed under Section 4(1)(b) of the Right to Information Act, 2005 (Stores Department)
- Information to be Proactively Disclosed under Section 4(1)(b) of the Right to Information Act, 2005 (Computer Department 2024–25)`



const DIRECT_GRIEVANCE_REPLY = `Steps to Submit a Grievance or Complaint
Step 1: Log in at: https://nwcmc.gov.in/web/citizen/grievance/login.php?uid=NzI4&id=ENG&cmd=clear#gsc.tab=0 
Use your Registered Mobile Number to log in.
If logging in for the first time, select New Registration.

Step 2: After logging in, open the sidebar menu and select New Complaint.

Step 3: Fill in the required details:
Zone (झोन)*
Department (विभाग)*
Category (श्रेणी)*
Priority (प्राधान्य)*
Address (पत्ता)*
Description (वर्णन)*
Optional details:
Ward (प्रभाग)
File (फाइल) – if any document needs to be uploaded

Step 4: Click Submit.
Note: To check the status of your grievance/complaint, go to the sidebar menu and select Complaint List. The current status of your application will be displayed there.`



const CONTACT_ENGLISH = `📞 Contact:
+912462234710, +912462234577`

const CONTACT_MARATHI = `📞 संपर्क: +91 2462 234710, +91 2462 234577`


const DIRECT_GRIEVANCE_REPLY_MARATHI = `📝 तक्रार/अर्ज सादर करण्याच्या पायऱ्या
पायरी 1: या लिंकवर लॉगिन करा – https://nwcmc.gov.in/web/citizen/grievance/login.php?uid=NzI4&id=ENG&cmd=clear#gsc.tab=0
लॉगिन करण्यासाठी तुमचा नोंदणीकृत मोबाईल नंबर वापरा.
प्रथम लॉगिन करत असल्यास New Registration निवडा.

पायरी 2: लॉगिन केल्यानंतर, साइडबार मेनूमधून New Complaint निवडा.

पायरी 3: आवश्यक माहिती भरा:
Zone (झोन)*
Department (विभाग)*
Category (श्रेणी)*
Priority (प्राधान्य)*
Address (पत्ता)*
Description (वर्णन)*
पर्यायी माहिती:
Ward (प्रभाग)
File (फाइल) – आवश्यक असल्यास दस्तऐवज अपलोड करा

पायरी 4: Submit वर क्लिक करा.
टीप: तुमच्या तक्रारी/अर्जाची स्थिती तपासण्यासाठी, साइडबार मेनूमधून Complaint List निवडा. तुमच्या अर्जाची सद्यस्थिती तिथे दिसेल.`



const DIRECT_RTI_REPLY_MARATHI = `या लिंकवर जा – https://nwcmc.gov.in/web/others.php?uid=NDM1&id=ENG&#gsc.tab=0
विविध माहितीचा अधिकार (RTS) संदर्भातील माहिती:
माहितीचा अधिकार अधिनियम, 2005
माहितीचा अधिकार आदेश
माहितीचा अधिकार आदेश – 17/12/2015
माहितीचा अधिकार आदेश – 07/07/2017
माहितीचा अधिकार आदेश – 14/12/2017
माहितीचा अधिकार आदेश – 23/08/2018
माहितीचा अधिकार आदेश – 17/07/2019
माहितीचा अधिकार आदेश – 13/10/2020
माहितीचा अधिकार आदेश – 15/12/2020
माहितीचा अधिकार आदेश – 16/09/2021
माहितीचा अधिकार आदेश – 09/03/2023
माहितीचा अधिकार अधिनियम, 2005 कलम 4(1)(ख) नुसार स्वयंप्रेरणेने जाहीर करावयाची माहिती (संगणक विभाग)
माहितीचा अधिकार अधिनियम, 2005 कलम 4(1)(ख) नुसार स्वयंप्रेरणेने जाहीर करावयाची माहिती (भांडार विभाग)
माहितीचा अधिकार अधिनियम, 2005 कलम 4(1)(ख) नुसार स्वयंप्रेरणेने जाहीर करावयाची माहिती (संगणक विभाग 2024–25)`




  const AIChatbot = {
    initialized: false,
    config: null,
    isOpen: false,
    messages: [],

    // Conversation state
    currentLanguage: null, // 'english' | 'marathi'
    currentLevel: "language_select", // 'language_select' | 'top_category' | 'second_menu' | 'submenu' | 'free_text'
    currentTopCategory: null, // 'rts' | 'rti' | 'payments' | 'grievance'
    currentMenuContext: null, // selected menu object (within a top category)

    // Voice features state (NEW)
    sttSupported: false,
    ttsSupported: false,
    recognition: null,
    isListening: false,
    speaking: false,
    selectedVoice: null,

    // Menu structures
    MENU_STRUCTURE: {
      english: {
        welcome: "Hi, please choose a language to continue.\nनमस्कार, पुढे जाण्यासाठी कृपया भाषा निवडा.",
        topCategories: [
          { label: "RTS", key: "rts" },
          { label: "RTI", key: "rti" },
          { label: "Key Payment Serving", key: "payments" },
          { label: "Grievance", key: "grievance" },
          { label: "Emergency Contact", key: "contact" },
          // { label: "Emergency Contact", key: "suggestion" },
        ],
        // RTS full menus with submenus
        rts: {
          title: "Right to Services (RTS)",
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
                { label: "New tax Assessment", query: "New Assessment of Property tax" },
                { label: "Re-Assessment of tax", query: "Re-Assessment of Property tax" },
                {
                  label: "Demo/Rebuild Assessment",
                  query: "Demo/Rebuild Assessment",
                },
                { label: "Name Transfer–Documents", query: "Name Transfer - By Valid Documents" },
                { label: "Name Transfer - Heirship", query: "Name Transfer - By Heirship" },
                { label: "Name Transfer - Other Way", query: "Name Transfer - By Other Way" },
                { label: "Name Transfer - Division", query: "Name Transfer - By Property Division" },
                { label: "Tax Exemption-Property tax", query: "Tax Exemption for Property tax" },
                { label: "Tax Exemption -Unoccupied", query: "Tax Exemption - Unoccupied" },
                { label: "Raising Tax Objection", query: "Raising Tax Objection" },
                { label: "Self Assessment of tax", query: "Self Assessment of Property tax" },
                { label: "Demand Bill of Property tax", query: "Demand Bill of Property tax" },
                { label: "NOC- Property Tax", query: "No Dues Certificate - Property Tax" },
                { label: "Pay Your Property Tax", query: "Pay Your Property Tax" },
                { label: "Property Tax Ledger", query: "Extract of Property Tax Ledger" },
              ],
            },
            {
              label: "Water",
              query: "Water",
              submenus: [
                { label: "New Water Connection", query: "New Water Connection" },
                { label: "NOC - Water Charges", query: "No Dues Certificate - Water Charges" },
                { label: "Demand Bill for Usage", query: "Demand Bill for Water Usage" },
                { label: "Water Connection Certificate", query: "Water Connection Certificate" },
                { label: "Complaint- Faulty Meter", query: "Complaint for Faulty Meter" },
                { label: "Complaint- Water Pressure", query: "Complaint for Water Pressure" },
                { label: "Complaint- Water Quality", query: "Complaint for Water Quality" },
                { label: "Complaint- Illegal Connection", query: "Complaint for Illegal Connection" },
                { label: "OwneR Change- Connection", query: "Ownership Change of Water Connection" },
                { label: "Change in Tap Size", query: "Change in Tap Size" },
                { label: "Disconnection", query: "Disconnection of Water Connection" },
                { label: "Change in Usage Category", query: "Change in Water Usage Category" },
                { label: "Re-Connection", query: "Re-Connection of Water Connection" },
                { label: "Plumber License - New", query: "Plumber License - New" },
                { label: "Plumber License Renewal", query: "Renewal of Plumber License" },
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
                { label: "Nursing Home Regi. -New", query: "Nursing Home Registration - New" },
                { label: "Nursing Home Regi. -Renewal", query: "Nursing Home Registration - Renewal" },
                { label: "Nursing Home -Owner Change", query: "Nursing Home Regi. - Ownership Change" },
                { label: "Cleanliness in City", query: "Maintenance of Cleanliness in City" },
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
                { label: "Hoarding/Sinage License", query: "Hoarding & Sinage License" },
                { label: "Movies Shooting License", query: "Movies Shooting License" },
              ],
            },
            {
              label: "Garden",
              query: "Garden",
              submenus: [{ label: "Tree Cutting Permission", query: "Permission for Tree Cutting" }],
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
                { label: "Transfer of Ownership", query: "Transfer of Trade Licence Ownership" },
                { label: "Change in the Firm Name", query: "Change in the Firm Name" },
                { label: "Change in the Trade Category", query: "Change in the Trade Category" },
                { label: "Change in the Partner's Name", query: "Change in the Partner's Name" },
                { label: "Addition/Removal of Partner", query: "Addition/Removal of Partner" },
                { label: "Cancellation of License", query: "Cancellation of Trade License" },
                { label: "Duplicate copy of Licence", query: "Duplicate copy of Trade Licence" },
                { label: "Auto Renewal of Licence", query: "Auto Renewal of Trade Licence" },
                { label: "Notice For Expired Licence", query: "Notice For Expired Trade Licence" },
                { label: "Hawker Registration", query: "Hawker Registration" },
                { label: "Lodging House-New Licence", query: "Lodging House - New Licence" },
                { label: "Lodging House-Renewal Licence", query: "Lodging House - Renewal of Licence" },
                { label: "Function Hall-New Licence", query: "Function Hall - New Licence" },
                { label: "Function Hall-Renewal Licence", query: "Function Hall - Renewal of Licence" },
              ],
            },
            {
              label: "PWD",
              query: "PWD",
              submenus: [{ label: "Fill Pot Holes", query: "To Fill Pot Holes in Road" }],
            },
            {
              label: "Sewer",
              query: "Sewer",
              submenus: [
                { label: "New Drainage Connection", query: "New Drainage Connection" },
                { label: "Maintenance of Gutter", query: "Maintenance of Gutter /Manhole Cover" },
              ],
            },
          ],
        },
        // Payment Serving only Water, Property, Trade with two submenus
        payments: {
          title: "Key Payment Serving",
          menus: [
            {
              label: "Water",
              query: "Payment - Water",
              submenus: [
                { label: "Payment Steps", query: "Payment Steps for Water" },
                { label: "Offline Payment", query: "Offline Payment for Water" },
              ],
            },
            {
              label: "Property",
              query: "Payment - Property",
              submenus: [
                { label: "Payment Steps", query: "Payment Steps for Property" },
                { label: "Offline Payment", query: "Offline Payment for Property" },
              ],
            },
          ],
        },
        // RTI, Grievance, Suggestion updated sections below
        rti: {
          title: "Right to Information (RTI)",
          // No menus/submenus; show a direct reply
          directReply: DIRECT_RTI_REPLY,
          menus: [],
        },
        grievance: {
          title: "Grievance",
          // No menus/submenus; show a direct reply
          directReply: DIRECT_GRIEVANCE_REPLY,
          menus: [],
        },

        // suggestion: {
        //   title: "Suggestion",
        //   // Exactly 2 menus, no submenus; each menu directly replies
        //   menus: [
        //     {
        //       label: "Online Form",
        //       query: "suggestion_online",
        //       submenus: [],
        //       replyKey: "Suggestion Online Form", // uses SAMPLE_RESPONSES
        //     },
        //     {
        //       label: "Offline",
        //       query: "suggestion_offline",
        //       submenus: [],
        //       reply:
        //         "Submit your suggestion offline at the ward office counter and collect an acknowledgement (sample).",
        //     },
        //   ],
        // },

        contact: {
          title: "Emergency Contact",
          // Exactly 2 menus, no submenus; each menu directly replies
          directReply: CONTACT_ENGLISH,
          menus: [],
        },


        other_option: "Other (Ask a question)",
        back_main: "Main Categories",
        back_prev: "Back",
        start_over: "Start Over",
      },

      // Marathi localization
      marathi: {
        welcome: "नमस्कार, पुढे जाण्यासाठी कृपया भाषा निवडा.\nHi, please choose a language to continue.",
        topCategories: [
          { label: "RTS (हक्क सेवा)", key: "rts" },
          { label: "RTI (माहितीचा अधिकार)", key: "rti" },

          { label: "महत्वाची देय सेवा", key: "payments" },
          { label: "तक्रार", key: "grievance" },
          { label: "📞 आपत्कालीन कॉल क्रमांक", key: "contact" },
          // { label: "सूचना", key: "suggestion" },
        ],
        rts: {
          title: "RTS (हक्क सेवा)",
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
                { label: "कर मूल्यांकन-पाडणे/पुनर्रचना", query: "Tax Assessment - Demolition & Reconstruct" },
                { label: "दस्तऐवजांवर आधारित नाव बदला", query: "Name Transfer - By Valid Documents" },
                { label: "वारसाहक्कावर आधारित नाव बदला", query: "Name Transfer - By Heirship" },
                { label: "इतर मार्गाने नाव बदला", query: "Name Transfer - By Other Way" },
                { label: "मालमत्ता विभागणीने नाव बदला", query: "Name Transfer - By Property Division" },
                { label: "मालमत्ता करासाठी कर सवलत", query: "Tax Exemption for Property tax" },
                { label: "अवास्तव मालमत्तेसाठी कर सवलत", query: "Tax Exemption - Unoccupied" },
                { label: "कर आक्षेप नोंदवा", query: "Raising Tax Objection" },
                { label: "स्वयं मूल्यांकन मालमत्ता कर", query: "Self Assessment of Property tax" },
                { label: "मालमत्ता कर मागणी बिल", query: "Demand Bill of Property tax" },
                { label: "नो ड्यूस प्रमाणपत्र - कर", query: "No Dues Certificate - Property Tax" },
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
                { label: "कनेक्शनचा मालकी हक्क बदला", query: "Ownership Change of Water Connection" },
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
                { label: "नर्सिंग होम नोंदणी -नवीन", query: "Nursing Home Registration - New" },
                { label: "नर्सिंग होम नोंदणी -नूतनीकरण", query: "Nursing Home Registration - Renewal" },
                { label: "नर्सिंग होम नोंदणी -मालकी बदल", query: "Nursing Home Regi. - Ownership Change" },
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
                { label: "परवा आपोआप नूतनीकरण", query: "Auto Renewal of Trade Licence" },
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
                { label: "गटर/मॅनहोल कव्हरची देखभाल", query: "Maintenance of Gutter /Manhole Cover" },
              ],
            },
          ],
        },
        payments: {
          title: "महत्वाची देय सेवा",
          menus: [
            {
              label: "पाणी",
              query: "Payment - Water",
              submenus: [
                { label: "पेमेंट टप्पे पाणी", query: "Payment Steps for Water" },
                { label: "ऑफलाइन पेमेंट", query: "Offline Payment for Water" },
              ],
            },
            {
              label: "मालमत्ता",
              query: "Payment - Property",
              submenus: [
                { label: "पेमेंट टप्पे मालमत्ता", query: "Payment Steps for Property" },
                { label: "ऑफलाइन पेमेंट", query: "Offline Payment for Property" },
              ],
            },
          ],
        },
        // RTI, Grievance, Suggestion updated sections below
        rti: {
          title: "RTI (माहितीचा अधिकार)",
          directReply: DIRECT_RTI_REPLY_MARATHI,
          menus: [],
        },
        grievance: {
          title: "तक्रार",
          directReply: DIRECT_GRIEVANCE_REPLY_MARATHI,
          menus: [],
        },

        contact: {
          title: "📞 आपत्कालीन कॉल क्रमांक",
          // Exactly 2 menus, no submenus; each menu directly replies
          directReply: CONTACT_MARATHI,
          menus: [],
        },


        // suggestion: {
        //   title: "सूचना",
        //   menus: [
        //     {
        //       label: "ऑनलाइन फॉर्म",
        //       query: "suggestion_online",
        //       submenus: [],
        //       replyKey: "Suggestion Online Form",
        //     },
        //     {
        //       label: "ऑफलाइन",
        //       query: "suggestion_offline",
        //       submenus: [],
        //       reply: "तुमची सूचना कार्यालयात ऑफलाइन जमा करा आणि पावती घ्या (नमुना).",
        //     },
        //   ],
        // },
        other_option: "इतर (प्रश्न विचारा)",
        back_main: "मुख्य श्रेणी",
        back_prev: "मागे",
        start_over: "पुन्हा सुरू करा",
      },
    },

    // Sample replies for RTI & Grievance (and can be reused as placeholders)
SAMPLE_RESPONSES  : {
      "RTI Apply Online": `RTI Online:
- Visit the RTI portal (sample).
- Fill applicant details and subject matter.
- Upload supporting documents (if any).
- Pay the prescribed fee online.
- Submit and note the acknowledgment number.`,
      "RTI Apply Offline": `RTI Offline:
- Write an RTI application addressed to the PIO.
- Include your contact details and specific information sought.
- Attach fee via DD/IPO as applicable.
- Submit at the designated office and collect acknowledgment.`,
      "RTI Application Fee": `RTI Fee (Sample):
- Application Fee: Rs. 10
- Inspection Fee: Rs. 5 per page (sample)
- Additional charges may apply as per rules.`,
      "RTI Inspection Fee": `RTI Inspection (Sample):
- Inspection charges per page: Rs. 5 (sample)
- Payable at the time of document collection.`,
      "RTI First Appeal": `RTI First Appeal (Sample):
- File within 30 days of PIO's response/non-response.
- Address to the First Appellate Authority.
- Attach original RTI copy and acknowledgment.`,
      "RTI Second Appeal": `RTI Second Appeal (Sample):
- File to the State Information Commission.
- Include copies of RTI application and first appeal decision.`,
      "Submit Grievance Online": `Submit Grievance (Sample - Online):

      
- Go to Grievance portal (sample).
- Enter details, attach photos (optional).
- Submit and note the grievance ID.`,
      "Submit Grievance Offline": `Submit Grievance (Sample - Offline):
- Visit the ward office.
- Fill grievance form with contact details.
- Submit and collect receipt/ID.`,
      "Track Grievance By ID": `Track Grievance (Sample):
- Enter your grievance ID on the portal to view status.`,
      "Track Grievance By Mobile": `Track Grievance (Sample):
- Use your registered mobile number to fetch the grievance status.`,
      "Suggestion Online Form": `Suggestion (Sample):
- Use the online suggestion form to submit your inputs.`,
      "Offline Payment for Water": `Water - Offline Payment (Sample):
- Pay at the designated office counters.`,
      "Offline Payment for Property": `Property - Offline Payment (Sample):
- Pay at authorized collection centers.`,
      "Offline Payment for Trade": `Trade - Offline Payment (Sample):
- Pay at the trade licensing office.`,
      "Offline Payment for Nursing Home": `Nursing Home - Offline Payment (Sample):
- Pay at the Nursing Home licensing office.`,
      "Offline Payment for Fire Noc": `Fire Noc - Offline Payment (Sample):
- Pay at the Fire Noc licensing office.`,
    },

    init: function (config) {
      if (this.initialized) return
      this.config = config
      this.initialized = true
      this.createWidget()
      this.attachEventListeners()
      this.resetChat()
      // Initialize voice features (NEW)
      this.initVoice()
    },

    createWidget: function () {
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

          #ai-chatbot-greeting-curve {
              position: absolute;
              bottom: 17px;
              right: -54px;
              width: 180px;
              height: 100px;
              pointer-events: none;
          }

          #ai-chatbot-greeting-curve svg {
            width: 100%;
            height: 100%;
          }

          #ai-chatbot-greeting-curve text {
            fill: #00a8e8;
            font-size: 18px;
            font-weight: bold;
            font-family: 'Comic Sans MS', cursive, sans-serif;
          }

          .wave-emoji {
            position: absolute;
            left: 8px;
            bottom: 23px;
            font-size: 22px;
            animation: wave 1.2s infinite;
          }

          @keyframes wave {
            0% { transform: rotate(0.0deg); }
            10% { transform: rotate(14.0deg); }
            20% { transform: rotate(-8.0deg); }
            30% { transform: rotate(14.0deg); }
            40% { transform: rotate(-4.0deg); }
            50% { transform: rotate(10.0deg); }
            60% { transform: rotate(0.0deg); }
            100% { transform: rotate(0.0deg); }
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
            width: 300px;
            height: 412px;
            bottom: 55px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            display: none;
            flex-direction: column;
            overflow: hidden;
          }
          #ai-chatbot-header {
            background: #111844;
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height:20px;
          }
          #ai-chatbot-header h3 {
            margin: 0;
            color:white;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          /* NEW: header actions container for mic and close buttons */
          #ai-chatbot-header-actions {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .ai-chatbot-header-logo { height: 24px; width: auto; }

          /* NEW: Header microphone button styles */
          #ai-chatbot-mic {
            background: rgba(255,255,255,0.15);
            border: none;
            border-radius: 50%;
            width: 28px; height: 28px;
            cursor: pointer;
            display: inline-flex; align-items: center; justify-content: center;
            transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
          }
          #ai-chatbot-mic:hover { transform: scale(1.05); box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
          #ai-chatbot-mic svg { width: 14px; height: 14px; fill: #fff; }
          #ai-chatbot-mic.listening { background: #ef4444; }
          #ai-chatbot-mic:disabled { opacity: 0.5; cursor: not-allowed; }

          #ai-chatbot-close {
            background: none; border: none; color: white; cursor: pointer;
            font-size: 20px; padding: 0; width: 24px; height: 24px;
            display: flex; align-items: center; justify-content: center;
          }
          #ai-chatbot-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1px;
            background: #fff;
          }
          .ai-chatbot-message {
            max-width: 80%;
            padding: 8px 12px;
            border-radius: 12px;
            font-size: 12px;
            line-height: 1.4;
            font-weight:600;
          }
          .ai-chatbot-message.user {
            background: #2a3864;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
          }
          .ai-chatbot-message.bot {
            background: #f1f5f9;
            color: #334155;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            font-size: 11px;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            max-width: 90%;
          }
          .ai-chatbot-message.bot a {
            color: #007bff; /* Bright blue color */
            text-decoration: underline; /* Optional: adds underline */
            word-break: break-all; /* Ensures long URLs wrap properly */
          }

          .ai-chatbot-message.bot a:hover {
            color: #rgb(15, 0, 83)/* Darker blue on hover */
          }
          .ai-chatbot-message.typing {
            background: #f1f5f9;
            color: #64748b;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .ai-chatbot-typing-logo { height: 20px; width: auto; }
          .ai-chatbot-welcome-logo-container {
            display: block;
            min-height: 110px;
            margin: auto;
          }
          .ai-chatbot-welcome-logo {
            max-height: 90px; 
            object-fit: contain;
          }
          #ai-chatbot-input-container {
            padding: 16px; 
            border-top: 1px solid #e2e8f0; 
            display: flex; 
            gap: 8px;
          }
          #ai-chatbot-input {
            flex: 1; border: 1px solid #e2e8f0; 
            border-radius: 20px; 
            padding: 8px 16px;
            font-size: 14px; 
            outline: none; 
            resize: none; font-family: 
            inherit; height: 20px; 
            scrollbar-width: none;
            height: 40px;
          }
          #ai-chatbot-input:focus { border-color: ${this.config.theme.primaryColor}; }
          #ai-chatbot-send {
            background: ${this.config.theme.primaryColor}; border: none; border-radius: 50%;
            width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: opacity 0.2s;
          }
          #ai-chatbot-send:disabled { opacity: 0.5; cursor: not-allowed; }
          #ai-chatbot-send svg { width: 16px; height: 16px; fill: white; }
          .ai-chatbot-buttons-container {
            display: flex; flex-direction: column; gap: 8px; margin-top: 12px; width: 100%; align-items: flex-start;
          }
          .ai-chatbot-button-option {            
            background: #e2e8f0;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 5px 15px;
            font-size: 12px;
            cursor: pointer;
            text-align: left;
            width: 90%;
            transition: background 0.2s, border-color 0.2s;
            font-weight: 606;
            height: 30px;
          }
          .ai-chatbot-button-option:hover { background: #d1d5db; border-color: #94a3b8; }
          @media (max-width: 480px) {
            #ai-chatbot-window { width: calc(100vw - 40px); height: calc(100vh - 100px); bottom: 80px; right: 20px; }
          }
        </style>
         
        <div id="ai-chatbot-greeting-curve">
          <span class="wave-emoji">👋</span>
          <svg viewBox="0 0 300 100">
            <defs>
              <path id="curvePath" d="M 50 80 Q 150 0 250 80" />
            </defs>
            <text width="100%">
              <textPath href="#curvePath" startOffset="50%" text-anchor="middle">
                How can we assist?
              </textPath>
            </text>
          </svg>
        </div>

        <button id="ai-chatbot-button" title="Open Chat">
          <img src="https://nwcmc.gov.in/web/upload_files/website/img/logo/weblogo6364d3f0f495b6ab9dcf8d3b5c6e0b01.png" alt="Open Chat" style="height: 45px;">
        </button>

        <div id="ai-chatbot-window">
          <div id="ai-chatbot-header">
            <h3><img src="${LOGO_URL}" alt="NWCMC Logo" class="ai-chatbot-header-logo" /> NWCMC Assistant</h3>
            <div id="ai-chatbot-header-actions">
              <button id="ai-chatbot-close" aria-label="Close">&times;</button>
            </div>
          </div>
          <div id="ai-chatbot-messages"></div>
          <div id="ai-chatbot-input-container">
            <textarea id="ai-chatbot-input" placeholder="Type your message..." aria-label="Message input"></textarea>
            <button id="ai-chatbot-send" disabled aria-label="Send">
              <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
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
      const micBtn = document.getElementById("ai-chatbot-mic")

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

      // NEW: Mic click toggles listening; works independently as voice search
      if (micBtn) {
        micBtn.addEventListener("click", async () => {
          if (!this.sttSupported) {
            this.addMessageToHistory(
              this.currentLanguage === "marathi"
                ? "क्षमस्व, तुमच्या ब्राउझरमध्ये आवाज इनपुट समर्थित नाही."
                : "Sorry, voice input is not supported in your browser.",
            )
            return
          }
          if (this.isListening) {
            this.stopListening(true)
          } else {
            await this.startListening()
          }
        })
      }
    },

    toggleWidget: function () {
      const windowElement = document.getElementById("ai-chatbot-window")
      if (this.isOpen) {
        this.closeWidget()
      } else {
        windowElement.style.display = "flex"
        this.isOpen = true
        this.renderMessages()
        document.getElementById("ai-chatbot-input").focus()
        this.updateInputState()
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
      return (text || "").replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
      })
    },

    // Renders history
    renderMessages: function () {
      const messagesContainer = document.getElementById("ai-chatbot-messages")
      messagesContainer.innerHTML = ""

      this.messages.forEach((msg) => {
        if (msg.type === "text") {
          const messageDiv = document.createElement("div")
          messageDiv.classList.add("ai-chatbot-message", msg.isUser ? "user" : "bot")
          const content = msg.content || ""
          messageDiv.innerHTML = this.linkify(content)
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

    addMessageToHistory: function (content, isUser = false, type = "text") {
      this.messages.push({ type, content, isUser })
      if (this.isOpen) this.renderMessages()
    },

    addButtonsToHistory: function (buttons) {
      this.messages.push({ type: "buttons", buttons })
      if (this.isOpen) this.renderMessages()
    },

    appendButtonsToDOM: function (buttons) {
      const messagesContainer = document.getElementById("ai-chatbot-messages")
      const buttonsContainer = document.createElement("div")
      buttonsContainer.className = "ai-chatbot-buttons-container"

      buttons.forEach((btn) => {
        const buttonElement = document.createElement("button")
        buttonElement.className = "ai-chatbot-button-option"
        buttonElement.textContent = btn.label
        buttonElement.dataset.action = btn.action // 'language' | 'top' | 'menu' | 'submenu' | 'other' | nav actions
        buttonElement.dataset.value = btn.value || ""
        // Keep some additional context
        if (btn.top) buttonElement.dataset.top = btn.top
        if (btn.menuQuery) buttonElement.dataset.menuQuery = btn.menuQuery
        if (btn.subQuery) buttonElement.dataset.subQuery = btn.subQuery

        buttonElement.addEventListener("click", () => this.handleButtonClick(buttonElement))
        buttonsContainer.appendChild(buttonElement)
      })
      messagesContainer.appendChild(buttonsContainer)
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    },

    updateInputState: function () {
      const input = document.getElementById("ai-chatbot-input")
      const sendBtn = document.getElementById("ai-chatbot-send")
      const micBtn = document.getElementById("ai-chatbot-mic")

      if (this.currentLevel === "free_text") {
        input.disabled = false
        sendBtn.disabled = !input.value.trim()
        input.focus()
      } else {
        input.disabled = true
        sendBtn.disabled = true
      }

      // Mic should be available independently (enable if STT supported)
      if (micBtn) {
        if (this.sttSupported) {
          micBtn.disabled = false
          micBtn.style.opacity = "1"
          micBtn.style.cursor = "pointer"
        } else {
          micBtn.disabled = true
          micBtn.style.opacity = "0.5"
          micBtn.style.cursor = "not-allowed"
        }
      }
    },

    resetChat: function () {
      this.messages = []
      this.currentLanguage = null
      this.currentLevel = "language_select"
      this.currentTopCategory = null
      this.currentMenuContext = null

      // Prominent logo
      this.addMessageToHistory(null, false, "welcome_logo")
      // Welcome + language buttons
      this.addMessageToHistory("Welcome to NWCMC Assistant / NWCMC सहाय्यकात स्वागत — Choose Language / भाषा निवडा")
      this.addButtonsToHistory([
        { label: "English", action: "language", value: "english" },
        { label: "Marathi", action: "language", value: "marathi" },
      ])
      this.updateInputState()
    },

    // Navigation helpers
    showTopCategories: function () {
      const lang = this.MENU_STRUCTURE[this.currentLanguage]
      this.addMessageToHistory(this.currentLanguage === "marathi" ? "कृपया श्रेणी निवडा:" : "Please choose a category:")
      const buttons = lang.topCategories.map((c) => ({
        label: c.label,
        action: "top",
        top: c.key,
      }))
      buttons.push({ label: lang.other_option, action: "other" })
      this.addButtonsToHistory(buttons)
      this.updateInputState()
    },

    showSecondMenus: function () {
      const lang = this.MENU_STRUCTURE[this.currentLanguage]
      const topKey = this.currentTopCategory
      const block = lang[topKey]
      this.addMessageToHistory(block.title)
      const buttons = block.menus.map((m) => ({
        label: m.label,
        action: "menu",
        top: topKey,
        menuQuery: m.query,
      }))
      buttons.push({ label: lang.back_main, action: "back_to_top" }, { label: lang.other_option, action: "other" })
      this.addButtonsToHistory(buttons)
      this.updateInputState()
    },

    showSubmenus: function (menuQuery) {
      const lang = this.MENU_STRUCTURE[this.currentLanguage]
      const topKey = this.currentTopCategory
      const block = lang[topKey]
      const menu = block.menus.find((m) => m.query === menuQuery)
      if (!menu) return

      this.currentMenuContext = menu
      const header =
        this.currentLanguage === "marathi"
          ? `निवडले: ${menu.label}\nकृपया उप-श्रेणी निवडा:`
          : `${menu.label} selected.\nPlease choose a sub-category:`
      this.addMessageToHistory(header)

      const buttons = menu.submenus.map((s) => ({
        label: s.label,
        action: "submenu",
        top: topKey,
        menuQuery: menu.query,
        subQuery: s.query,
      }))
      buttons.push(
        { label: this.MENU_STRUCTURE[this.currentLanguage].back_prev, action: "back_to_second" },
        { label: this.MENU_STRUCTURE[this.currentLanguage].back_main, action: "back_to_top" },
        { label: this.MENU_STRUCTURE[this.currentLanguage].other_option, action: "other" },
      )
      this.addButtonsToHistory(buttons)
      this.updateInputState()
    },

    // Button handling
    handleButtonClick: async function (buttonElement) {
      const action = buttonElement.dataset.action
      const value = buttonElement.dataset.value
      const label = buttonElement.textContent
      const top = buttonElement.dataset.top
      const menuQuery = buttonElement.dataset.menuQuery
      const subQuery = buttonElement.dataset.subQuery

      if (!["back_to_top", "back_to_second"].includes(action)) {
        this.addMessageToHistory(label, true)
      }

      if (action === "language") {
        this.currentLanguage = value
        this.currentLevel = "top_category"
        const lang = this.MENU_STRUCTURE[this.currentLanguage]
        this.addMessageToHistory(lang.welcome)
        if (this.recognition) this.recognition.lang = this.getCurrentLangCode()
        if (this.ttsSupported) {
          const wanted = this.getCurrentLangCode()
          this.selectedVoice = this.pickVoiceFor(wanted, window.speechSynthesis.getVoices())
        }
        this.showTopCategories()
        return
      }

      if (action === "top") {
        this.currentTopCategory = top

        // NEW: Direct reply for RTI and Grievance
        if (top === "rti" || top === "grievance" || top === "contact") {
          const block = this.MENU_STRUCTURE[this.currentLanguage][top]
          if (block?.directReply) {
            this.addMessageToHistory(block.directReply)
            this.offerNav()
            this.currentLevel = "top_category"
            this.updateInputState()
            return
          }
        }

        // Suggestion now has only two menus (no submenus) -> still show second level
        if (top === "suggestion") {
          this.currentLevel = "second_menu"
          this.currentMenuContext = null
          this.showSecondMenus()
          return
        }

        // Default flow for RTS and Payments
        this.currentLevel = "second_menu"
        this.currentMenuContext = null
        this.showSecondMenus()
        return
      }

      if (action === "menu") {
        // NEW: If the chosen menu has no submenus, reply immediately
        const lang = this.MENU_STRUCTURE[this.currentLanguage]
        const topKey = this.currentTopCategory
        const block = lang?.[topKey]
        const menu = block?.menus?.find((m) => m.query === menuQuery)

        if (menu && (!menu.submenus || menu.submenus.length === 0)) {
          if (menu.reply) {
            this.addMessageToHistory(menu.reply)
          } else if (menu.replyKey) {
            const sample = this.SAMPLE_RESPONSES[menu.replyKey] || "Information will appear here."
            this.addMessageToHistory(sample)
          } else {
            this.addMessageToHistory("Information will appear here.")
          }
          this.offerNav()
          this.updateInputState()
          return
        }

        // Otherwise continue to submenus as before
        this.currentLevel = "submenu"
        this.showSubmenus(menuQuery)
        return
      }

      if (action === "submenu") {
        const topKey = this.currentTopCategory
        const langKey = this.currentLanguage
        const fullQuery = `${topKey.toUpperCase()} - ${menuQuery} - ${subQuery}`

        // Keep payments and other samples same
        // if (topKey === "payments") {
        //   const sample = this.SAMPLE_RESPONSES[subQuery] || "Payment information (sample) will appear here."
        //   this.addMessageToHistory(sample)
        //   this.offerNav()
        //   return
        // }

        // Default: call backend AI (unchanged)
        this.currentLevel = "free_text"
        this.updateInputState()

        const messagesContainer = document.getElementById("ai-chatbot-messages")
        const typingMessageDiv = document.createElement("div")
        typingMessageDiv.classList.add("ai-chatbot-message", "bot", "typing")
        typingMessageDiv.innerHTML = `<img src="${LOGO_URL}" alt="Typing" class="ai-chatbot-typing-logo" /> <span class="dot-flashing"></span> ${
          langKey === "marathi" ? "माहिती आणत आहे..." : "Fetching information..."
        }`
        messagesContainer.appendChild(typingMessageDiv)
        messagesContainer.scrollTop = messagesContainer.scrollHeight

        try {
          const response = await fetch(this.config.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: fullQuery, language: langKey }),
          })
          const data = await response.json()
          typingMessageDiv.remove()
          this.addMessageToHistory(
            data.response || (langKey === "marathi" ? "क्षमस्व, माहिती उपलब्ध नाही." : "Sorry, no information found."),
          )
          // if (data && data.response) this.speakText(data.response)
          this.offerNav()
        } catch (err) {
          console.error("Chat error:", err)
          typingMessageDiv.remove()
          this.addMessageToHistory(
            langKey === "marathi" ? "क्षमस्व, कनेक्शनमध्ये समस्या आहे." : "Sorry, I'm having trouble connecting.",
          )
          this.offerNav()
        } finally {
          this.currentLevel = "submenu"
          this.updateInputState()
        }
        return
      }

      if (action === "other") {
        this.currentLevel = "free_text"
        this.addMessageToHistory(
          this.currentLanguage === "marathi" ? "कृपया तुमचा प्रश्न टाइप करा." : "Please type your question.",
        )
        this.updateInputState()
        return
      }

      if (action === "back_to_top") {
        this.currentLevel = "top_category"
        this.currentMenuContext = null
        this.showTopCategories()
        return
      }

      if (action === "back_to_second") {
        this.currentLevel = "second_menu"
        this.currentMenuContext = null
        this.showSecondMenus()
        return
      }

      if (action === "start_over") {
        this.resetChat()
        return
      }
    },

    offerNav: function () {
      const lang = this.MENU_STRUCTURE[this.currentLanguage]
      this.addButtonsToHistory([
        { label: lang.back_prev, action: "back_to_second" },
        { label: lang.back_main, action: "back_to_top" },
        { label: lang.start_over, action: "start_over" },
      ])
    },

    async sendMessage(message = null, isMenuItem = false) {
      const input = document.getElementById("ai-chatbot-input")
      const sendBtn = document.getElementById("ai-chatbot-send")
      const messageToSend = message || input.value.trim()
      if (!messageToSend) return

      if (!isMenuItem) {
        this.addMessageToHistory(messageToSend, true)
      }

      input.value = ""
      sendBtn.disabled = true
      this.autoResize(input)

      // Typing indicator
      const messagesContainer = document.getElementById("ai-chatbot-messages")
      const typingMessageDiv = document.createElement("div")
      typingMessageDiv.classList.add("ai-chatbot-message", "bot", "typing")
      typingMessageDiv.innerHTML = `<img src="${LOGO_URL}" alt="Typing" class="ai-chatbot-typing-logo" /> <span class="dot-flashing"></span> ${
        this.currentLanguage === "marathi" ? "माहिती आणत आहे..." : "Fetching information..."
      }`
      messagesContainer.appendChild(typingMessageDiv)
      messagesContainer.scrollTop = messagesContainer.scrollHeight

      try {
        const response = await fetch(this.config.apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageToSend,
            language: this.currentLanguage || "english",
          }),
        })
        const data = await response.json()
        typingMessageDiv.remove()
        this.addMessageToHistory(
          data.response ||
            (this.currentLanguage === "marathi" ? "क्षमस्व, माहिती उपलब्ध नाही." : "Sorry, no information found."),
        )
        // Speak the response (NEW)
        // if (data && data.response) {
        //   this.speakText(data.response)
        // }
      } catch (error) {
        console.error("Chat error:", error)
        typingMessageDiv.remove()
        this.addMessageToHistory(
          this.currentLanguage === "marathi" ? "क्षमस्व, कनेक्शनमध्ये समस्या आहे." : "Sorry, I'm having trouble connecting.",
        )
      } finally {
        // After free-text, offer navigation options
        this.offerNav()
        this.updateInputState()
      }
    },

    // ===== Voice utilities (NEW) =====

    // Current BCP-47 language for STT/TTS
    getCurrentLangCode: function () {
      if (this.currentLanguage === "marathi") return "mr-IN"
      return "en-IN" // default English; change to 'en-US' if you prefer
    },

    // Initialize TTS and STT
    initVoice: function () {
      // TTS support
      this.ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window
      if (this.ttsSupported) {
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices()
          this.selectedVoice = this.pickVoiceFor(this.getCurrentLangCode(), voices)
        }
        window.speechSynthesis.onvoiceschanged = () => loadVoices()
        loadVoices()
      }

      // STT support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        this.sttSupported = true
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = false
        this.recognition.interimResults = false
        this.recognition.maxAlternatives = 1
        this.recognition.lang = this.getCurrentLangCode()

        this.recognition.onstart = () => {
          this.isListening = true
          const micBtn = document.getElementById("ai-chatbot-mic")
          if (micBtn) micBtn.classList.add("listening")
        }
        this.recognition.onend = () => {
          this.isListening = false
          const micBtn = document.getElementById("ai-chatbot-mic")
          if (micBtn) micBtn.classList.remove("listening")
        }
        this.recognition.onerror = (e) => {
          console.error("STT error:", e)
          this.isListening = false
          const micBtn = document.getElementById("ai-chatbot-mic")
          if (micBtn) micBtn.classList.remove("listening")
          if (e.error !== "no-speech") {
            this.addMessageToHistory(
              this.currentLanguage === "marathi"
                ? "आवाज कॅप्चर करण्यात समस्या आली."
                : "There was a problem capturing your voice.",
            )
          }
        }
        this.recognition.onresult = (event) => {
          try {
            const transcript = (event.results?.[0]?.[0]?.transcript || "").trim()
            if (transcript) {
              // Show user's voice as text and query KB backend
              this.addMessageToHistory(transcript, true)
              this.sendMessage(transcript, true)
            }
          } catch (err) {
            console.error("STT parse error:", err)
          }
        }
      } else {
        this.sttSupported = false
        const micBtn = document.getElementById("ai-chatbot-mic")
        if (micBtn) {
          micBtn.disabled = true
          micBtn.title = this.currentLanguage === "marathi" ? "आवाज इनपुट उपलब्ध नाही" : "Voice input not available"
        }
      }
    },

    // Choose a voice matching lang; fallback sensibly
    pickVoiceFor: (lang, voices) => {
      if (!voices || !voices.length) return null
      const exact = voices.find((v) => v.lang?.toLowerCase() === lang.toLowerCase())
      if (exact) return exact
      const base = lang.split("-")[0].toLowerCase()
      const sameBase = voices.find((v) => v.lang?.toLowerCase().startsWith(base))
      if (sameBase) return sameBase
      const google = voices.find((v) => v.name?.toLowerCase().includes("google"))
      return google || voices[0]
    },

    // Start listening to user speech
    startListening: async function () {
      try {
        if (!this.recognition) return
        // Align recognition language
        this.recognition.lang = this.getCurrentLangCode()

        // Stop any speaking to avoid echo
        if (this.ttsSupported && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel()
        }

        this.recognition.start()
      } catch (err) {
        console.error("Failed to start STT:", err)
        this.addMessageToHistory(
          this.currentLanguage === "marathi" ? "मायक्रोफोन सुरू करता आला नाही." : "Could not start the microphone.",
        )
      }
    },

    // Stop listening
    stopListening: function () {
      try {
        if (!this.recognition) return
        this.recognition.stop()
      } catch (err) {
        console.error("Failed to stop STT:", err)
      }
    },

    // Speak text response
    speakText: function (text) {
      if (!this.ttsSupported || !text) return
      try {
        // Optional: only speak when widget is open
        if (!this.isOpen) return

        window.speechSynthesis.cancel()

        const utter = new SpeechSynthesisUtterance(text)
        const voices = window.speechSynthesis.getVoices()
        if (!this.selectedVoice) {
          this.selectedVoice = this.pickVoiceFor(this.getCurrentLangCode(), voices)
        }
        utter.lang = this.selectedVoice?.lang || this.getCurrentLangCode()
        if (this.selectedVoice) utter.voice = this.selectedVoice
        utter.rate = 1.0
        utter.pitch = 1.0
        utter.volume = 1.0

        this.speaking = true
        utter.onend = () => (this.speaking = false)
        utter.onerror = (e) => {
          console.error("TTS error:", e)
          this.speaking = false
        }
        window.speechSynthesis.speak(utter)
      } catch (err) {
        console.error("Failed to speak:", err)
      }
    },
  }

  // Expose globally
  window.AIChatbot = AIChatbot
})()


//commented from lne 857:- or near the cross button of chatbot closing
{/* <button id="ai-chatbot-mic" aria-label="Voice input" title="Voice input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 7a7 7 0 0 0 7-7h-2a5 5 0 0 1-10 0H5a7 7 0 0 0 7 7zm-1 3h2v-2h-2v2z"/>
                </svg>
              </button> */}

//1280 and 1374 for speaking the text which has now been commented i.e. wherever:-
//  if (data && data.response)
# Interface words: review sheet

Written by `npm run review-sheet` from `src/i18n/*.ts`; do not edit by hand (tests/content.test.ts checks it is current). For a
native speaker of each language: read every line of your column beside the English, and send corrections to hello@geometer.dev or
edit the strings file directly. When a language is done, put the reviewer's name in its `reviewedBy` (the first line of the
strings object). Until then that language's pages are built and reachable from the language switch, but carry `noindex` and stay
out of the sitemap.

Notes for reviewers: brand names (Streetlist, Geometer, DiceBear, RSS, AI) stay in Latin letters; the words should be plain and
warm, as a shopkeeper or a farmer would say them; see docs/editorial.md for the words we never use. Phrases with a number or a name
are shown with a sample (5, "Livelihoods", "Geometer").

- **हिन्दी** (src/i18n/hi.ts): waiting for review
- **മലയാളം** (src/i18n/ml.ts): waiting for review
- **ಕನ್ನಡ** (src/i18n/kn.ts): waiting for review

| Key | English | हिन्दी | മലയാളം | ಕನ್ನಡ |
| --- | --- | --- | --- | --- |
| `site.tagline` | The future, built locally. | भविष्य, जो यहीं बनता है। | ഭാവി, ഇവിടെത്തന്നെ പണിതെടുക്കുന്നു. | ನಾವೇ ಇಲ್ಲಿ ಕಟ್ಟುವ ಭವಿಷ್ಯ. |
| `site.sub` | Stories and ideas about technology, livelihoods, and people shaping the places they call home. | तकनीक, रोज़ी-रोटी, और अपने घर-गाँव को सँवारते लोगों की कहानियाँ और विचार। | സാങ്കേതികവിദ്യ, ഉപജീവനം, സ്വന്തം നാടിനെ രൂപപ്പെടുത്തുന്ന മനുഷ്യർ എന്നിവയെക്കുറിച്ചുള്ള കഥകളും ആശയങ്ങളും. | ತಂತ್ರಜ್ಞಾನ, ಜೀವನೋಪಾಯ ಮತ್ತು ತಮ್ಮ ಊರನ್ನು ರೂಪಿಸುತ್ತಿರುವ ಜನರ ಕುರಿತ ಕಥೆಗಳು ಮತ್ತು ವಿಚಾರಗಳು. |
| `site.skip` | Skip to the content | सामग्री पर जाएँ | ഉള്ളടക്കത്തിലേക്ക് പോകുക | ವಿಷಯಕ್ಕೆ ನೇರವಾಗಿ ಹೋಗಿ |
| `site.navLabel` | Main | मुख्य | പ്രധാനം | ಮುಖ್ಯ |
| `site.streetlistTitle` | Streetlist: pages and assistants for local services | Streetlist: स्थानीय सेवाओं के अपने पेज और सहायक | Streetlist: പ്രാദേശിക സേവനങ്ങൾക്കുള്ള പേജുകളും സഹായികളും | Streetlist: ಸ್ಥಳೀಯ ಸೇವೆಗಳಿಗಾಗಿ ಪುಟಗಳು ಮತ್ತು ಸಹಾಯಕರು |
| `site.themeLabel` | Dark theme | डार्क थीम | ഡാർക്ക് തീം | ಡಾರ್ಕ್ ಥೀಮ್ |
| `site.langLabel` | Language | भाषा | ഭാഷ | ಭಾಷೆ |
| `site.runsOn` | Runs on Geometer | Geometer पर चलता है | Geometer-ൽ പ്രവർത്തിക്കുന്നു | Geometer ಮೇಲೆ ನಡೆಯುತ್ತದೆ |
| `home.intro` | Villages and small towns can own and run their own intelligence: local services, set up by local people, with the value staying where it is made. Owners keep their money, the Operators who set things up keep their margin, and a community can own the services it relies on. This Journal is where art, ideas and technology meet that everyday life. | गाँव और छोटे शहर अपनी AI सेवाएँ खुद चला सकते हैं: स्थानीय लोग उन्हें बनाते हैं, और उनका मूल्य वहीं रहता है जहाँ काम होता है। दुकान का पैसा मालिक के पास रहता है, सेवा शुरू करने वाले ऑपरेटर अपना मार्जिन रखते हैं, और समुदाय उन सेवाओं का मालिक हो सकता है जिन पर वह निर्भर है। यह जर्नल वह जगह है जहाँ कला, विचार और तकनीक रोज़मर्रा की ज़िंदगी से मिलते हैं। | ഗ്രാമങ്ങൾക്കും ചെറുപട്ടണങ്ങൾക്കും സ്വന്തം AI സേവനങ്ങൾ സ്വയം നടത്താം: നാട്ടുകാർ അവ ഒരുക്കുന്നു, അതിന്റെ മൂല്യം ജോലി നടക്കുന്നിടത്തുതന്നെ നിലനിൽക്കുന്നു. കടയുടെ പണം ഉടമയ്ക്ക്, സേവനം ഒരുക്കുന്ന പ്രാദേശിക ഓപ്പറേറ്റർമാർക്ക് അവരുടെ മാർജിൻ, ആശ്രയിക്കുന്ന സേവനങ്ങളുടെ ഉടമസ്ഥത സമൂഹത്തിന്. കലയും ആശയങ്ങളും സാങ്കേതികവിദ്യയും ദൈനംദിന ജീവിതവുമായി കണ്ടുമുട്ടുന്ന ഇടമാണ് ഈ ജേണൽ. | ಹಳ್ಳಿಗಳು ಮತ್ತು ಸಣ್ಣ ಪಟ್ಟಣಗಳು ತಮ್ಮದೇ AI ಸೇವೆಗಳನ್ನು ತಾವೇ ನಡೆಸಬಹುದು: ಸ್ಥಳೀಯರು ಅವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಾರೆ, ಅವುಗಳ ಮೌಲ್ಯ ಕೆಲಸ ನಡೆಯುವಲ್ಲೇ ಉಳಿಯುತ್ತದೆ. ಅಂಗಡಿಯ ಹಣ ಮಾಲೀಕರಿಗೆ, ಸೇವೆಯನ್ನು ಸಿದ್ಧಪಡಿಸುವ ಸ್ಥಳೀಯ ಆಪರೇಟರ್‌ಗಳಿಗೆ ಅವರ ಮಾರ್ಜಿನ್, ತಾನು ಅವಲಂಬಿಸಿರುವ ಸೇವೆಗಳ ಒಡೆತನ ಸಮುದಾಯಕ್ಕೆ. ಕಲೆ, ವಿಚಾರ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ದಿನನಿತ್ಯದ ಬದುಕನ್ನು ಸಂಧಿಸುವ ಜಾಗ ಈ ಜರ್ನಲ್. |
| `home.soon` | The first pieces are being written. Check back soon. | पहले लेख लिखे जा रहे हैं। जल्द ही फिर देखिए। | ആദ്യ ലേഖനങ്ങൾ എഴുതിക്കൊണ്ടിരിക്കുന്നു. വൈകാതെ വീണ്ടും നോക്കൂ. | ಮೊದಲ ಲೇಖನಗಳನ್ನು ಬರೆಯಲಾಗುತ್ತಿದೆ. ಸ್ವಲ್ಪ ಸಮಯದಲ್ಲೇ ಮತ್ತೆ ನೋಡಿ. |
| `home.lead` | Lead story | मुख्य कहानी | പ്രധാന കഥ | ಮುಖ್ಯ ಕಥೆ |
| `home.latest` | Latest | ताज़ा | പുതിയവ | ಹೊಸದು |
| `home.sections` | Sections | विभाग | വിഭാഗങ്ങൾ | ವಿಭಾಗಗಳು |
| `home.more` | More in Livelihoods | Livelihoods में और | Livelihoods: കൂടുതൽ | Livelihoods: ಇನ್ನಷ್ಟು |
| `home.empty` | Nothing here yet. | यहाँ अभी कुछ नहीं है। | ഇവിടെ ഇതുവരെ ഒന്നുമില്ല. | ಇಲ್ಲಿ ಇನ್ನೂ ಏನೂ ಇಲ್ಲ. |
| `home.write` | Have a story for this section? Write to us. | इस विभाग के लिए कोई कहानी है? हमें लिखें। | ഈ വിഭാഗത്തിന് ഒരു കഥയുണ്ടോ? ഞങ്ങൾക്ക് എഴുതൂ. | ಈ ವಿಭಾಗಕ್ಕೆ ಒಂದು ಕಥೆ ಇದೆಯೇ? ನಮಗೆ ಬರೆಯಿರಿ. |
| `home.aboutTitle` | About the Journal | जर्नल के बारे में | ജേണലിനെക്കുറിച്ച് | ಜರ್ನಲ್ ಬಗ್ಗೆ |
| `home.aboutText` | Why a magazine about villages and small towns running their own services, and how we write it. | गाँवों और छोटे शहरों की अपनी सेवाओं पर एक पत्रिका क्यों, और हम इसे कैसे लिखते हैं। | ഗ്രാമങ്ങളുടെയും ചെറുപട്ടണങ്ങളുടെയും സ്വന്തം സേവനങ്ങളെക്കുറിച്ച് ഒരു മാസിക എന്തിന്, ഞങ്ങൾ അത് എങ്ങനെ എഴുതുന്നു. | ಹಳ್ಳಿಗಳು ಮತ್ತು ಸಣ್ಣ ಪಟ್ಟಣಗಳ ಸ್ವಂತ ಸೇವೆಗಳ ಬಗ್ಗೆ ಒಂದು ಪತ್ರಿಕೆ ಏಕೆ, ಮತ್ತು ನಾವು ಅದನ್ನು ಹೇಗೆ ಬರೆಯುತ್ತೇವೆ. |
| `home.aboutLink` | Read about the Journal | जर्नल के बारे में पढ़ें (अंग्रेज़ी में) | ജേണലിനെക്കുറിച്ച് വായിക്കുക (ഇംഗ്ലീഷിൽ) | ಜರ್ನಲ್ ಬಗ್ಗೆ ಓದಿ (ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ) |
| `piece.by` | By Geometer | लेखक: Geometer | എഴുതിയത്: Geometer | ಬರೆದವರು: Geometer |
| `piece.minRead` | 5 min read | पढ़ने में 5 मिनट | വായിക്കാൻ 5 മിനിറ്റ് | ಓದಲು 5 ನಿಮಿಷ |
| `piece.updated` | Updated 9 Nov 2026 | अपडेट: 9 Nov 2026 | പുതുക്കിയത്: 9 Nov 2026 | ನವೀಕರಿಸಿದ್ದು: 9 Nov 2026 |
| `piece.inEnglish` | In English | अंग्रेज़ी में | ഇംഗ്ലീഷിൽ | ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ |
| `piece.alsoIn` | Also in | इन भाषाओं में भी | ഈ ഭാഷകളിലും | ಈ ಭಾಷೆಗಳಲ್ಲೂ |
| `piece.coverCredit` | Cover: drawn for the Streetlist Journal with DiceBear | कवर: Streetlist Journal के लिए DiceBear से बनाया गया | കവർ: Streetlist Journal-നായി DiceBear ഉപയോഗിച്ച് വരച്ചത് | ಮುಖಪುಟ ಚಿತ್ರ: Streetlist Journal-ಗಾಗಿ DiceBear ಬಳಸಿ ಬಿಡಿಸಿದ್ದು |
| `piece.coverAlt` | A cover in the colour of Livelihoods: the story's cartoon companion, curious, beside a speech bubble. | Livelihoods के रंग में कवर: कहानी का कार्टून साथी, curious, बातचीत के एक गुब्बारे के पास। | Livelihoods എന്ന വിഭാഗത്തിന്റെ നിറത്തിൽ ഒരു കവർ: കഥയുടെ കാർട്ടൂൺ കൂട്ടുകാരൻ, curious, ഒരു സംഭാഷണ കുമിളയ്ക്കരികിൽ. | Livelihoods ವಿಭಾಗದ ಬಣ್ಣದಲ್ಲಿ ಮುಖಪುಟ ಚಿತ್ರ: ಕಥೆಯ ಕಾರ್ಟೂನ್ ಜೊತೆಗಾರ, curious, ಮಾತಿನ ಗುಳ್ಳೆಯ ಪಕ್ಕದಲ್ಲಿ. |
| `piece.exampleWho.customer` | Customer | ग्राहक | ഉപഭോക്താവ് | ಗ್ರಾಹಕರು |
| `piece.exampleWho.helper` | AI helper | AI सहायक | AI സഹായി | AI ಸಹಾಯಕ |
| `piece.exampleWho.owner` | The owner sees | मालिक को दिखता है | ഉടമ കാണുന്നത് | ಮಾಲೀಕರು ನೋಡುವುದು |
| `piece.sources` | Sources and corrections | स्रोत और सुधार | ഉറവിടങ്ങളും തിരുത്തലുകളും | ಮೂಲಗಳು ಮತ್ತು ತಿದ್ದುಪಡಿಗಳು |
| `piece.corrections` | Corrections: | सुधार: | തിരുത്തലുകൾ: | ತಿದ್ದುಪಡಿಗಳು: |
| `piece.noCorrections` | none recorded. | कोई दर्ज नहीं। | ഒന്നും രേഖപ്പെടുത്തിയിട്ടില്ല. | ಯಾವುದೂ ದಾಖಲಾಗಿಲ್ಲ. |
| `piece.keepReading` | Keep reading | और पढ़ें | തുടർന്നു വായിക്കുക | ಇನ್ನಷ್ಟು ಓದಿ |
| `piece.elsewhere` | More to read on geometer.dev | geometer.dev पर और पढ़ें | geometer.dev-ൽ കൂടുതൽ വായിക്കാൻ | geometer.dev ನಲ್ಲಿ ಇನ್ನಷ್ಟು ಓದಲು |
| `piece.allJournal` | All of the Journal | पूरा जर्नल | ജേണൽ മുഴുവൻ | ಇಡೀ ಜರ್ನಲ್ |
| `piece.reviewedBy` | Translation reviewed by A. Reviewer | अनुवाद की समीक्षा: A. Reviewer | പരിഭാഷ പരിശോധിച്ചത്: A. Reviewer | ಅನುವಾದ ಪರಿಶೀಲಿಸಿದವರು: A. Reviewer |
| `lists.count` | 5 pieces | 5 लेख | ലേഖനങ്ങൾ: 5 | ಲೇಖನಗಳು: 5 |
| `lists.emptyTopic` | Nothing in this section yet. | इस विभाग में अभी कोई लेख नहीं है। | ഈ വിഭാഗത്തിൽ ഇതുവരെ ലേഖനങ്ങളില്ല. | ಈ ವಿಭಾಗದಲ್ಲಿ ಇನ್ನೂ ಲೇಖನಗಳಿಲ್ಲ. |
| `moods.well` | cheerful | खुश | സന്തോഷത്തിൽ | ಖುಷಿಯಾಗಿ |
| `moods.needs` | curious | जिज्ञासु | ആകാംക്ഷയോടെ | ಕುತೂಹಲದಿಂದ |
| `moods.wrong` | worried | चिंतित | ആശങ്കയോടെ | ಚಿಂತೆಯಿಂದ |
| `moods.closed` | asleep | सोया हुआ | ഉറക്കത്തിൽ | ನಿದ್ದೆಯಲ್ಲಿ |
| `moods.busy` | busy | व्यस्त | തിരക്കിൽ | ಬಿಡುವಿಲ್ಲದೆ |
| `notFound.title` | This page has stepped out | यह पेज अभी यहाँ नहीं है | ഈ പേജ് ഇപ്പോൾ ഇവിടെയില്ല | ಈ ಪುಟ ಈಗ ಇಲ್ಲಿಲ್ಲ |
| `notFound.text` | The address may have changed, or the page never existed. The front page has every piece. | पता बदल गया होगा, या यह पेज कभी था ही नहीं। मुख पृष्ठ पर हर लेख है। | വിലാസം മാറിയിരിക്കാം, അല്ലെങ്കിൽ ഈ പേജ് ഒരിക്കലും ഉണ്ടായിരുന്നില്ല. എല്ലാ ലേഖനങ്ങളും മുഖപേജിലുണ്ട്. | ವಿಳಾಸ ಬದಲಾಗಿರಬಹುದು, ಅಥವಾ ಈ ಪುಟ ಎಂದೂ ಇರಲಿಲ್ಲ. ಎಲ್ಲಾ ಲೇಖನಗಳು ಮುಖಪುಟದಲ್ಲಿವೆ. |
| `notFound.home` | Go to the front page | मुख पृष्ठ पर जाएँ | മുഖപേജിലേക്ക് പോകുക | ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ |
| `notFound.other` | Or read the Journal in | या जर्नल पढ़ें | അല്ലെങ്കിൽ ജേണൽ വായിക്കുക | ಅಥವಾ ಜರ್ನಲ್ ಓದಿ |
| `footer.about` | About the Journal | जर्नल के बारे में | ജേണലിനെക്കുറിച്ച് | ಜರ್ನಲ್ ಬಗ್ಗೆ |
| `footer.feed` | RSS feed | RSS फ़ीड | RSS ഫീഡ് | RSS ಫೀಡ್ |
| `footer.streetlist` | Streetlist | Streetlist | Streetlist | Streetlist |
| `footer.credits` | Characters drawn with DiceBear (MIT licence); the character styles are CC0. | किरदार DiceBear (MIT लाइसेंस) से बनाए गए हैं; किरदारों की शैलियाँ CC0 हैं। | കഥാപാത്രങ്ങൾ DiceBear (MIT ലൈസൻസ്) ഉപയോഗിച്ച് വരച്ചവ; കഥാപാത്ര ശൈലികൾ CC0 ആണ്. | ಪಾತ್ರಗಳನ್ನು DiceBear (MIT ಪರವಾನಗಿ) ಬಳಸಿ ಬಿಡಿಸಲಾಗಿದೆ; ಪಾತ್ರಗಳ ಶೈಲಿಗಳು CC0. |
| `footer.contact` | Write to hello@geometer.dev | hello@geometer.dev पर लिखें | hello@geometer.dev എന്ന വിലാസത്തിൽ എഴുതൂ | hello@geometer.dev ಗೆ ಬರೆಯಿರಿ |
| `footer.write` | Stories, drawings and corrections are welcome. | कहानियाँ, चित्र और सुधार भेजें, आपका स्वागत है। | കഥകളും ചിത്രങ്ങളും തിരുത്തലുകളും സ്വാഗതം. | ಕಥೆಗಳು, ಚಿತ್ರಗಳು ಮತ್ತು ತಿದ್ದುಪಡಿಗಳಿಗೆ ಸ್ವಾಗತ. |
| `labels.idea.name` | Idea | प्रस्ताव | നിർദ്ദേശം | ಪ್ರಸ್ತಾವನೆ |
| `labels.idea.gloss` | A proposal. Nobody has tried it yet. | एक प्रस्ताव। अभी तक किसी ने इसे आज़माया नहीं है। | ഒരു നിർദ്ദേശം. ഇതുവരെ ആരും പരീക്ഷിച്ചിട്ടില്ല. | ಒಂದು ಪ್ರಸ್ತಾವನೆ. ಇನ್ನೂ ಯಾರೂ ಪ್ರಯತ್ನಿಸಿಲ್ಲ. |
| `labels.practical-guide.name` | Practical guide | व्यावहारिक गाइड | പ്രായോഗിക വഴികാട്ടി | ಪ್ರಾಯೋಗಿಕ ಮಾರ್ಗದರ್ಶಿ |
| `labels.practical-guide.gloss` | How to do one thing, step by step. | एक काम कैसे करें, कदम-दर-कदम। | ഒരു കാര്യം എങ്ങനെ ചെയ്യാം, പടിപടിയായി. | ಒಂದು ಕೆಲಸವನ್ನು ಹಂತ ಹಂತವಾಗಿ ಮಾಡುವುದು ಹೇಗೆ. |
| `labels.experiment.name` | Experiment | प्रयोग | പരീക്ഷണം | ಪ್ರಯೋಗ |
| `labels.experiment.gloss` | A small test: what we ran and what we saw. | एक छोटा परीक्षण: हमने क्या चलाया और क्या देखा। | ഒരു ചെറിയ പരീക്ഷണം: ഞങ്ങൾ എന്തു ചെയ്തു, എന്തു കണ്ടു. | ಒಂದು ಸಣ್ಣ ಪರೀಕ್ಷೆ: ನಾವು ಏನು ನಡೆಸಿದೆವು, ಏನು ಕಂಡೆವು. |
| `labels.field-report.name` | Field report | ज़मीनी रिपोर्ट | ഫീൽഡ് റിപ്പോർട്ട് | ಕ್ಷೇತ್ರ ವರದಿ |
| `labels.field-report.gloss` | What happened in a real shop or group, with dates. | किसी असली दुकान या समूह में क्या हुआ, तारीख़ों के साथ। | ഒരു യഥാർത്ഥ കടയിലോ കൂട്ടായ്മയിലോ സംഭവിച്ചത്, തീയതികളോടെ. | ನಿಜವಾದ ಅಂಗಡಿ ಅಥವಾ ಗುಂಪಿನಲ್ಲಿ ನಡೆದದ್ದು, ದಿನಾಂಕಗಳೊಂದಿಗೆ. |
| `labels.research.name` | Research | शोध | ഗവേഷണം | ಸಂಶೋಧನೆ |
| `labels.research.gloss` | Careful study, with its sources and its limits. | सावधानी से किया गया अध्ययन, अपने स्रोतों और सीमाओं के साथ। | സൂക്ഷ്മമായ പഠനം, അതിന്റെ ഉറവിടങ്ങളും പരിമിതികളും സഹിതം. | ಎಚ್ಚರಿಕೆಯ ಅಧ್ಯಯನ, ಅದರ ಮೂಲಗಳು ಮತ್ತು ಮಿತಿಗಳೊಂದಿಗೆ. |
| `labels.opinion.name` | Opinion | राय | അഭിപ്രായം | ಅಭಿಪ್ರಾಯ |
| `labels.opinion.gloss` | A view we hold. You are welcome to disagree. | एक विचार जो हम रखते हैं। आप असहमत हो सकते हैं। | ഞങ്ങളുടെ ഒരു കാഴ്ചപ്പാട്. നിങ്ങൾക്ക് വിയോജിക്കാം. | ನಮ್ಮ ಒಂದು ನಿಲುವು. ನೀವು ಒಪ್ಪದಿರಬಹುದು. |
| `topics.technology.name` | Technology | तकनीक | സാങ്കേതികവിദ്യ | ತಂತ್ರಜ್ಞಾನ |
| `topics.technology.gloss` | Tools, machines and intelligence that a place can own and run itself. | औज़ार, मशीनें और AI, जिन्हें कोई जगह खुद अपना सके और चला सके। | ഒരു നാടിന് സ്വന്തമാക്കി സ്വയം നടത്താവുന്ന ഉപകരണങ്ങളും യന്ത്രങ്ങളും AI-യും. | ಒಂದು ಊರು ತಾನೇ ಹೊಂದಿ ನಡೆಸಬಹುದಾದ ಉಪಕರಣಗಳು, ಯಂತ್ರಗಳು ಮತ್ತು AI. |
| `topics.livelihoods.name` | Livelihoods | रोज़ी-रोटी | ഉപജീവനം | ಜೀವನೋಪಾಯ |
| `topics.livelihoods.gloss` | Work and commerce: shops, trades, services and the money that stays where it is made. | काम और व्यापार: दुकानें, हुनर, सेवाएँ, और वह पैसा जो वहीं रहता है जहाँ काम होता है। | ജോലിയും വ്യാപാരവും: കടകൾ, തൊഴിലുകൾ, സേവനങ്ങൾ, ജോലി നടക്കുന്നിടത്തുതന്നെ നിൽക്കുന്ന പണവും. | ಕೆಲಸ ಮತ್ತು ವ್ಯಾಪಾರ: ಅಂಗಡಿಗಳು, ಕಸುಬುಗಳು, ಸೇವೆಗಳು, ಮತ್ತು ಕೆಲಸ ನಡೆಯುವಲ್ಲೇ ಉಳಿಯುವ ಹಣ. |
| `topics.community.name` | Community and civic life | समुदाय और नागरिक जीवन | സമൂഹവും പൗരജീവിതവും | ಸಮುದಾಯ ಮತ್ತು ನಾಗರಿಕ ಜೀವನ |
| `topics.community.gloss` | How a village, a town or a ward shares, decides and looks after things together. | कोई गाँव, शहर या वार्ड मिलकर कैसे बाँटता है, तय करता है और चीज़ों की देखभाल करता है। | ഒരു ഗ്രാമമോ പട്ടണമോ വാർഡോ ഒരുമിച്ച് പങ്കിടുന്നതും തീരുമാനിക്കുന്നതും പരിപാലിക്കുന്നതും എങ്ങനെ. | ಒಂದು ಹಳ್ಳಿ, ಪಟ್ಟಣ ಅಥವಾ ವಾರ್ಡ್ ಒಟ್ಟಾಗಿ ಹಂಚಿಕೊಳ್ಳುವುದು, ನಿರ್ಧರಿಸುವುದು ಮತ್ತು ನೋಡಿಕೊಳ್ಳುವುದು ಹೇಗೆ. |
| `topics.ideas.name` | Ideas and philosophy | विचार और दर्शन | ആശയങ്ങളും ദർശനവും | ವಿಚಾರ ಮತ್ತು ತತ್ವಶಾಸ್ತ್ರ |
| `topics.ideas.gloss` | Questions about technology and everyday life, thought through slowly. | तकनीक और रोज़मर्रा के जीवन पर सवाल, धीरे-धीरे सोचे हुए। | സാങ്കേതികവിദ്യയെയും ദൈനംദിന ജീവിതത്തെയും കുറിച്ചുള്ള ചോദ്യങ്ങൾ, പതുക്കെ ആലോചിച്ചവ. | ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ದಿನನಿತ್ಯದ ಬದುಕಿನ ಕುರಿತ ಪ್ರಶ್ನೆಗಳು, ನಿಧಾನವಾಗಿ ಯೋಚಿಸಿದಂಥವು. |
| `topics.art.name` | Art and culture | कला और संस्कृति | കലയും സംസ്കാരവും | ಕಲೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ |
| `topics.art.gloss` | Pictures, songs, crafts and stories, and the everyday life around them. | चित्र, गीत, शिल्प और कहानियाँ, और उनके आसपास का रोज़मर्रा का जीवन। | ചിത്രങ്ങൾ, പാട്ടുകൾ, കരകൗശലങ്ങൾ, കഥകൾ, അവയ്ക്കു ചുറ്റുമുള്ള ദൈനംദിന ജീവിതവും. | ಚಿತ್ರಗಳು, ಹಾಡುಗಳು, ಕರಕುಶಲ ಮತ್ತು ಕಥೆಗಳು, ಅವುಗಳ ಸುತ್ತಲಿನ ದಿನನಿತ್ಯದ ಬದುಕು. |

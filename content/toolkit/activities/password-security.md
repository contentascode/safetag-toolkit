---
id: password-security
name: Password Security Survey
description: Weak and &quot;shared&quot; passwords are prevalent - even after hundreds of well-publicized global password...
origin: https://github.com/SAFETAG/SAFETAG
origin_path: master/en/exercises/password_security/summary.md
---
# Password Security Survey

## Summary

### Weak Passwords

Weak and "shared" passwords are prevalent - even after hundreds of well-publicized global password breaches, "password" and "12345" remain the most popular passwords. Weak wifi passwords are specifically a challenge, as wifi signals often are accessible outside of an office's physical limits, but provide full access to the private network.


## Materials Needed

* For the (most common) WPA password-based attacks, an already-prepared dictionary of words to use to attack the password will be required. See the Appendix on Audit Preparation for guidance on dictionary preparation.
* A Password Survey (see Appendix) for an alternate way to gather password practices
* The Level Up Activity, [Password Reverse Race](https://www.level-up.cc/leading-trainings/training-curriculum/activity/password-reverse-race) provides a staff activity.


## Walkthrough

This exercise supports the auditor in building an effective dictionary that is customized to an organization.  

This dictionary can then be used in a variety of ways:

* By using the examples referenced in the Network Access section, the auditor can attack weak wifi passwords, which present a non-personal and non-disruptive way to demonstrate password security problems.  Weak wifi passwords are specifically a challenge, as wifi signals often are accessible outside of an office's physical limits, but provide full access to the private network.
* An Auditor can show or discuss their preferred customization strategy and the tools (like JtR) that automatically "mutate" passwords with numbers, capitals, and so on, to demnonstrate the power of a computer to quickly get around common "tricks"
* An Auditor can also use a password "survey" to get an understanding of password practices within the organization.


#### Walkthrough

This skillset, plus demonstration against non-invasive accounts, provides an opening for a discussion with staff on password security. See [Level Up](https://www.level-up.cc/leading-trainings/training-curriculum/secure-passwords) for further activities and exercises around passwords.

 * Download basic word lists
 * Research dictionary needs
 * Create custom word list
 * Build core list(s)
 * Attack a password hash using increasingly more time-consuming methods

#### Instructions

This component provides resources and recommendations on cracking passwords - both the creation of dictionaries and rules to modify those dictionaries, as well as some basic implementation as well. This is a dangerous (and in many cases, illegal) skill to use, and should be more of a guide to auditors on what password security myths do not work against modern password cracking software, and to use only with permission and only in very specific situations as a demonstration of the power of even a common laptop against weak passwords.

Primarily for use in the Network Access component, building a password dictionary, understanding the ways to automatically mutate it, and running it against passwords is a useful skill to have, and to use to explain why simple passwords are insecure. This [Ars Technica article](http://arstechnica.com/security/2013/10/how-the-bible-and-youtube-are-fueling-the-next-frontier-of-password-cracking/) provides a good insight into the path to tackle iterative password cracking using a variety of tools to meet different goals.

These instructions use a small set of password cracking tools, but many are possible. If there are tools you are more familiar or comfortable with using, these by no means are required. The only constraints are to be respectful and responsible, as well as keeping focused on the overall goals and not getting bogged down.

A good wordlist with a few tweaks tends to break most passwords.  Using a collection of all English words, all words from the language of the organization being audited, plus a combination of all these words, plus relevant keywords, addresses, and years tends to crack most wifi passwords in a reasonable timeframe.

An approach which begins with quick, but often fruitful, attacks to more and more complex (and time consuming) attacks is the most rewarding. However, after an hour or two of password hacking, the in-office time on other activities is more valuable, so admit defeat and move on.  See the Recommendations section for talking points around the levels of password cracking that exist in the world.  You can work on passwords offline/overnight/post-audit for report completeness.

Here is a suggested path to take with suggested tools to help. You might try the first few steps in both the targeted keyword approach and the dictionary approach before moving on to the more complex mutations towards the end of each path.

 * Targeted Keywords
   * Begin with a simple combination of organizationally relevant keywords (using hashcat's combinator attack, combining your org keyword list with itself)
   * Add in numbers/years (simple scripting, hashcat, JtR)
   * Add in other mutators like 1337 replacements, capitalization tricks (John)
 * Language dictionary attack (simple scripting, hashcat)
   * Run a series of dictionary word attacks:
     * A simple language dictionary attack
     * Add in numbers/years (simple scripting, hashcat, JtR)
     * Add in the org keywords (a full combination creates a massive list, recommend starting with 1:1)
     * Try other combinations of the dictionary, keywords, years
     * Add in other mutators like 1337 replacements, capitalization tricks (John)
 * Brute forcing (do not bother with this on-site)
   * John's incremental modes, limited by types
   * Crunch's raw brute-force attack (very, very time intensive - a complete waste of time without GPUs)

#### Dictionary Research and Creation 

**Before you arrive on-site** it is important to have your password cracking tools downloaded and relevant dictionaries ready to go, as your main demonstration and use of these tools is to gain access to the organization's network. The effectiveness of this demonstration is drastically reduced if you already have had to ask for the password to connect to the Internet and update your dictionaries, tools, or so on. Some of these  files (especially larger password dictionaries) can be quite large, so downloading them in-country is not recommended.

Many password dictionary sites, such as [SkullSecurity](https://wiki.skullsecurity.org/Passwords) , maintain core dictionaries in multiple languages.  If your target language is not available, some quick regular expression work can turn spell-check dictionaries (such as those used by [LibreOffice](http://extensions.libreoffice.org/extension-center?getCategories=Dictionary) into useful word lists.  It is generally useful to always test with English in addition to the target language.

[CloudCracker](https://www.cloudcracker.com/dictionaries.html) and [OpenWall](http://www.openwall.com/wordlists/) have, for a fee, well-tested password dictionaries.

### Keyword generation

In addition, create a customized dictionary with words related to the subject as revealed in the Remote Assessment research: organization name, street address, phone number, email domain, wireless network name, etc. For the organization "ExampleOrg , which has its offices at 123 Central St., Federal District, Countryzstan , which does human rights and journalism work and was founded in 1992, some context-based dictionary additions would be:

```
exampleorg
example
exa
mple
org
123
central
federal
district
countryzstan
human
rights
journo
journalism
1992
92
```

Also add common password fragments: qwerty, 1234/5/6/7/8, and, based on field experience, four-digit dates back to the year 2001 (plus adding in the founding year of the organization). It's also useful to see what calendar system is in use at your organization's location as some cultures [don't use Gregorian years](https://en.wikipedia.org/wiki/Calendar#Calendars_in_use). It's quite amazing how often a recent year will be part of a wifi password -- this presentation discusses many common patterns in passwords: [https://www.owasp.org/images/a/af/2011-Supercharged-Slides-Redman-OWASP-Feb.pdf](https://www.owasp.org/images/a/af/2011-Supercharged-Slides-Redman-OWASP-Feb.pdf)

##### Optional Further steps

Use [CeWL](http://digi.ninja/projects/cewl.php), to spider the organization's web properties to generate additional phrases.  This list will need review, as some of the generated content is not very useful, but may be useful if the site is not in a language the auditor reads fluently.

For passwords other than WPA, specific policies or patterns may help to focus your password dictionary further.  [PACK, or Password Analysis and Cracking Toolkit](https://github.com/iphelix/PACK) is a collection of utilities developed to aid in analysis of password lists in order to enhance password cracking through pattern detection of masks, rules, character-sets and other password characteristics. The toolkit generates valid input files for Hashcat family of password crackers."  PACK is most useful for large sets of passwords, where it can detect patterns in already-broken passwords to help build new rules. Both password cracking tools listed here are powerful, and have slightly different abilities.  The auditor should choose the one they prefer and/or the one which has the features they desire for this job.

#### Combinator Attack with scripting and Hashcat

One quick way to build a more complex password list is to simply double the list up (a "combinator" attack), so that it includes an entry for each pair of these strings:

You can do a 1-way version of this list simply, such as:

```
 $ for foo in `cat pwdlist.txt`; do for bar in `cat pwdlist.txt`; do printf $foo$bar'\n'; done; done > pwdpairs.txt
 $ cat pwdlist.txt >> pwdpairs.txt
```

[Hashcat](http://hashcat.net/oclhashcat/) can do this in a live attack under its "combinator" mode, and hashcat-utils (hiding in /usr/share/hashcat-utils/combinator.bin) provides this as a standalone tool.  This provides a true combination of the list, so it exponentially increases the list size - use with caution, or use with one larger dictionary and one smaller dictionary.

For example, use these combination approach on your custom dictionary (combining it with itself, creating combinations from the above list such as example92, journorights, exampleorgrights).


```
$  /usr/share/hashcat-utils/combinator.bin dict.txt dict.txt

```

Hashcat is extremely powerful when you have desktop computer systems to use, but has a few wordlist manipulation tools that are useful regardless. 

More References: (http://hashcat.net/wiki/doku.php?id=cracking_wpawpa2 , http://www.darkmoreops.com/2014/08/18/cracking-wpa2-wpa-with-hashcat-kali-linux/ )


#### Word mutation with John the Ripper (JtR)

[JtR](https://github.com/magnumripper/JohnTheRipper/commits/bleeding-jumbo) is a powerful tool you can use in combination of existing wordlists, but it also can add in common substitutions (people using zero for the letter "o"). JtR can be used to generate a static list of passwords for other programs, or it can be used directly against a password database. JtR is a bit weak combining words within a wordlist, so you should apply your customizations and any folding before moving on to JtR.

You can add custom "rules" to aid in these substitutions - a base set is 
included with JtR, but a much more powerful set is added by [KoreLogic]
(http://contest-2010.korelogic.com/rules.html). KoreLogic also provides 
a custom character set "chr file" that takes password frequency data 
from large collections of [real-world passwords to speed up JtR's brute 
force mode](http://www.korelogic.com/tools.html) . This PDF presentation 
has a good [walkthrough of how John and Kore's rules work](https://www.owasp.org/images/a/af/2011-Supercharged-Slides-Redman-OWASP-Feb.pdf)

Additional guides:
  * (http://linuxconfig.org/password-cracking-with-john-the-ripper-on-linux)

The bleeding-edge jumbo version combines both the built-in rules and an 
optimized version of the [KoreLogic 
rules](https://github.com/kost/jtr-stuff/tree/master/rules, and 
http://openwall.info/wiki/john/rules for a description of the 
optimizations).  [This list of KoreLogic 
Rules](http://contest-2010.korelogic.com/rules.html) provides nice 
descriptions of what the KoreLogic rules do.  In bleeding-jumbo, you can 
remove "KoreLogicRules".  [BackReference](http://backreference.org/2009/10/26/password-recovery-with-john-the-ripper/) 
provides a great example of rules usage.

Some particularly useful ones individual rulesets are:
  * AppendYears (appends years, from 1900 to 2019) and AppendCurrentYearSpecial (appends 2000-2019 with punctuation)
  * AddJustNumbers (adds 1-4 digits to the end of everything)
  * l33t (leet-speek combinations)

There are some build-in combinations of rulesets - for example, just --rules runs john's internal collection of default rules, and --rules:KoreLogic runs a 
collection of the KoreLogic rules in a thoughtful order, and --rules:all is useful if you hate life.

e.g. :
```
  $ john -w:dictionary.txt --rules:AppendYears --stdout
```

[Building custom rules](http://www.openwall.com/john/doc/RULES.shtml)


**PROTIP** Create a dictionary with just "blah" and run various rules against it to understand how each ruleset or combination works. Note specifically that each rule multiplies the size of the dictionary by the number of permutations it introduces. Running the KoreLogic ruleset combination against a **one word** dictionary creates a list of 6,327,540 permutations on just that word.


#### Brute force, using John and crunch

JtR's "incremental" mode is essentially an optimized brute force attack, so will take a very long time for anything but the shortest passwords, or passwords where you can limit the search space to a character set: "As of version 1.8.0, pre-defined incremental modes are "ASCII" (all 95 printable ASCII characters), "LM_ASCII" (for use on LM hashes), "Alnum" (all 62 alphanumeric characters), "Alpha" (all 52 letters), "LowerNum" (lowercase letters plus digits, for 36 total), "UpperNum" (uppercase letters plus digits, for 36 total), "LowerSpace" (lowercase letters plus space, for 27 total), "Lower" (lowercase letters), "Upper" (uppercase letters), and "Digits" (digits only). The supplied .chr files include data for lengths up to 13 for all of these modes except for "LM_ASCII" (where password portions input to the LM hash halves are assumed to be truncated at length 7) and "Digits" (where the supplied .chr file and pre-defined incremental mode work for lengths up to 20). Some of the many .chr files needed by these pre-defined incremental modes might not be bundled with every version of John the Ripper, being available as a separate download." (http://www.openwall.com/john/doc/MODES.shtml)

As a last resort, you can try a direct brute force attack overnight or post-audit to fill in details on key strength.  Crunch is a very simple but thorough approach. Given enough time it will break a password, but it's not particularly fast, even at simple passwords. You can reduce the scope of this attack (and speed it up) if you have a reason to believe the password is all lower-case, all-numeric, or so on. WPA passwords are a minimum of 8 characters, a maximum of 16, and some wifi routers will accept punctuation, but in practice these are usually just !@#$. — so:

```
$ /path/to/crunch 8 16 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890$!@#$. | aircrack-ng -a 2 path/to/capture.pcap -b 00:11:22:33:44:55 -w -
```

This says to try every possible alpha-numeric combination from 8 to 16 characters. This will take a very, very, very long time. 

#### Recommendations

Any important password should be long enough and complex enough to prevent both standard dictionary attacks and “brute-force attacks” in which clusters of powerful computers work in parallel to test every possible character combination. (We recommend 12 or more completely random characters or a passphrase that contains five or more relatively uncommon words.) The key should not contain common “phrases,” expecially from well known literature like Shakespeare or religious texts, but also should not include number sequences or phrases, especially if they are related to the organization, its employees or its work. 

Specifically for wireless passwords, choosing a strong WPA key is one of the most ild not mportant steps toward defending an organization’s network perimeter from an adversary with the ability to spend some time in the vicinity of the offices. By extension, mitigating this vulnerability is critical to the protection of employees and partners (and confidential data) from the sort of persistent exposure that eventually brings down even the most well-secured information systems.

Because shared keys inevitably end up being written on whiteboards, given to office visitors and emailed to partners, the WPA key should also be changed periodically. This does not have to happen frequently, but anything less than three or four times per year may be unsafe.



##### Material that may be Useful:

**Sample Practice** For practice on any of these methods, you can use the wpa-Induction.pcap file from [Wireshark](http://wiki.wireshark.org/SampleCaptures).

##### Resources 
[https://www.schneier.com/blog/archives/2014/03/choosing_secure_1.html](https://www.schneier.com/blog/archives/2014/03/choosing_secure_1.html)

[http://zed0.co.uk/crossword/](http://zed0.co.uk/crossword/)

[http://www.instantcheckmate.com/crimewire/is-your-password-really-protecting-you/#lightbox/0/](http://www.instantcheckmate.com/crimewire/is-your-password-really-protecting-you/#lightbox/0/)

Note that password cracking systems are rated on the number of password guesses they make per second.  Stock laptop computers without high-end graphics cards or any other optimizations can guess 2500 passwords/second. More powerful desktop computers can test over a hundred million each second, and with graphics cards (GPUs) that rises to billions of passwords per second. ([https://en.wikipedia.org/wiki/Password_cracking](https://en.wikipedia.org/wiki/Password_cracking)).

This website has a good explanation about how improving the complexity of a password affects how easy it is to break: [http://www.lockdown.co.uk/?pg=combi](http://www.lockdown.co.uk/?pg=combi), but is using very out of date numbers - consider a basic laptop able to produce "Class E" attacks, and a desktop, "Class F"

[http://rumkin.com/tools/password/passchk.php](http://rumkin.com/tools/password/passchk.php)

[http://cyber-defense.sans.org/blog/downloads/](http://cyber-defense.sans.org/blog/downloads/) has a calculator buried in the zip file "scripts.zip"

[http://www.dailymail.co.uk/sciencetech/article-2331984/Think-strong-password-Hackers-crack-16-character-passwords-hour.html](http://www.dailymail.co.uk/sciencetech/article-2331984/Think-strong-password-Hackers-crack-16-character-passwords-hour.html)

[https://www.grc.com/haystack.htm](https://www.grc.com/haystack.htm)

[https://www.owasp.org/images/a/af/2011-Supercharged-Slides-Redman-OWASP-Feb.pdf](https://www.owasp.org/images/a/af/2011-Supercharged-Slides-Redman-OWASP-Feb.pdf)

[http://www.nytimes.com/2014/11/19/magazine/the-secret-life-of-passwords.html?_r=1](http://www.nytimes.com/2014/11/19/magazine/the-secret-life-of-passwords.html?_r=1)



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


# Post-exam teaching system

Every one of the 239 original questions was reviewed for beginner-facing ambiguity. All now have richer lesson metadata; all 965 choices have text-keyed feedback. Original question wording, options, answer keys, chapter assignments, and short explanations are unchanged. The existing score and sampling algorithms are unchanged.

## What students see

- A compact result card with selected/correct answers and a diagnosis.
- Separate omitted-correct and incorrectly-selected lists for select-all questions.
- A collapsed **Teach Me This** mini-lesson with relevant fields, examples, memory hooks, and a revealable transfer check.
- **Study This Concept**: missed-question focus first, broader notes second, then up to three other questions in the concept. This practice never writes exam progress, mastery, or missed-question history.
- Personalized downloads built from exactly the same teaching model, including the student's actual answer text and the full lesson.

Lessons describe *possible* misconceptions, not a psychological diagnosis. Unanswered questions do not imply a particular misconception. Correct answers remain available in Review All; perfect attempts create no phantom study notes.

## Data contract

`index.html` remains self-contained, with no build step. Each question may contain:

```js
lesson: {
  correctIdea: "Short correct concept",
  misconception: "A plausible source of confusion",
  explanation: "How or why it works",
  example: "Concrete example",
  mnemonic: "Only if useful",
  quickCheck: "Transfer question",
  quickCheckAnswer: "Answer and reasoning",
  choiceFeedback: { "Exact original choice text": "Why it fits or fails" },
  choiceLessons: { "Exact original choice text": { /* focused lesson fields */ } }
}
```

Fields are optional. The legacy `explanation` is retained as fallback. Choices are keyed by their text, never by a displayed letter or position; shuffling remaps the answer indices but does not change choice text. Select-all questions have individual choice lessons so omitting the first-shell statement teaches the two-electron capacity rather than a magnesium detour. Closely related single-answer questions share narrow teaching themes where appropriate; the selected-choice diagnosis still identifies the actual option.

`lessonFor` checks current bank metadata by stable question ID, then the question's own metadata, then its short explanation. This upgrades exams saved before the release without rewriting their answers. `teachingNote` supplies both rendered cards and text downloads. `relatedQuestions` samples the same concept with a different ID, then shuffles answer choices. A native modal dialog provides Escape-to-close, focus restoration, and independent unscored practice.

## Clarifications, not answer-key changes

No answer key was changed. Added qualifications prevent overgeneralization:

- A base accepts H⁺ **from solution**; binding it lowers free H⁺ rather than adding more.
- Shell capacity is not occupancy; the first shell fills at two, and an empty shell is not the outermost occupied shell.
- Ion charge concerns electrons; isotope identity concerns neutrons; element identity concerns protons.
- Lower pH means more H⁺; differences are logarithmic. Compare blood with its normal range, not only with pH 7. The neutral-pH reference is the introductory room-temperature convention.
- Pressure effects on reaction rate are especially relevant to compressible gases; extreme temperature can damage enzymes.
- Common cis double bonds bend fatty-acid chains; not all double-bond geometries do.
- ATP hydrolysis releases net energy through the overall reaction, rather than bond breaking by itself releasing energy.
- Positive/negative feedback describe amplification/opposition, not good/bad outcomes.
- Broad concept notes are labeled as broader review and do not replace exact-choice teaching.

## Reference checks

New teaching prose is original and intended for A&P I. Key distinctions were checked against these OpenStax A&P 2e sections:

- [Elements and atoms](https://openstax.org/books/anatomy-and-physiology-2e/pages/2-1-elements-and-atoms-the-building-blocks-of-matter)
- [Chemical bonds](https://openstax.org/books/anatomy-and-physiology-2e/pages/2-2-chemical-bonds)
- [Inorganic compounds](https://openstax.org/books/anatomy-and-physiology-2e/pages/2-4-inorganic-compounds-essential-to-human-functioning)
- [Organic compounds](https://openstax.org/books/anatomy-and-physiology-2e/pages/2-5-organic-compounds-essential-to-human-functioning)
- [Homeostasis](https://openstax.org/books/anatomy-and-physiology-2e/pages/1-5-homeostasis)
- [Anatomical terminology](https://openstax.org/books/anatomy-and-physiology-2e/pages/1-6-anatomical-terminology)

## Verification

Run `node --test tests/teaching.test.cjs`. The baseline SHA-256 represents the original bank serialized with `JSON.stringify`, before adding lesson metadata. It covers question content as well as keys. Do not regenerate it merely to silence an unintended change.

Browser verification also covers actual submission, ten wrong/partial/unanswered scenarios, download content, all six modes, modal practice without score/storage changes, saved legacy exam resume, perfect results, keyboard controls, and mobile overflow. Browser error monitoring found no JavaScript errors during these checks.

## Coverage inventory

Each row below represents a reviewed question with a lesson, choice feedback, example, and quick check. Memory hooks are omitted where they would add little value.

| ID | Concept | Question reviewed |
| --- | --- | --- |
| 1 | Anatomy vs Physiology | Which statement best distinguishes anatomy from physiology? |
| 2 | Anatomy vs Physiology | A researcher measures how strongly cardiac muscle contracts after a change in ion concentration. This is primarily a study of: |
| 3 | Anatomy vs Physiology | A student examines the muscles, blood vessels, nerves, connective tissues, and bones located in the shoulder. This is primarily: |
| 4 | Anatomy vs Physiology | A student studies all skeletal muscles throughout the body as a single body system. This is primarily: |
| 5 | Anatomy vs Physiology | Histology is the study of: |
| 6 | Anatomy vs Physiology | Cytology is the study of: |
| 7 | Anatomy vs Physiology | Gross anatomy studies structures that: |
| 8 | Anatomy vs Physiology | Which example best demonstrates the close relationship between structure and function? |
| 9 | Levels of Organization | Which sequence proceeds from least complex to most complex? |
| 10 | Levels of Organization | The smallest independently functioning unit of a living organism is a: |
| 11 | Levels of Organization | A tissue is best described as: |
| 12 | Levels of Organization | What distinguishes an organ from a tissue? |
| 13 | Levels of Organization | Which statement about organ systems is most accurate? |
| 14 | Levels of Organization | Which level immediately follows the tissue level in increasing complexity? |
| 15 | Levels of Organization | Which level is the highest level of organization in an individual human? |
| 16 | Levels of Organization | A structure composed of epithelial, connective, and muscle tissue that performs a specific function is a(n): |
| 17 | Levels of Organization | Select all levels more complex than a cell. |
| 18 | Organ Systems | Which system provides a protective external barrier and includes skin, hair, and nails? |
| 19 | Organ Systems | Which system uses hormones as chemical messengers to regulate body functions? |
| 20 | Organ Systems | Which system transports substances through blood and blood vessels? |
| 21 | Organ Systems | Which system is principally responsible for gas exchange? |
| 22 | Organ Systems | Which system provides support, protection, and a framework for movement? |
| 23 | Organ Systems | Which system produces body movement by contraction? |
| 24 | Organ Systems | Which system rapidly detects stimuli and coordinates responses? |
| 25 | Organ Systems | Which system removes nitrogenous wastes and helps regulate water and electrolytes? |
| 26 | Organ Systems | Which system breaks down food and absorbs nutrients? |
| 27 | Organ Systems | Which system contributes to immune defense and returns excess tissue fluid? |
| 28 | Life Functions & Metabolism | Metabolism is best defined as: |
| 29 | Life Functions & Metabolism | Anabolism generally: |
| 30 | Life Functions & Metabolism | Catabolism generally: |
| 31 | Life Functions & Metabolism | A cell combines smaller molecules into a larger molecule while using energy. This is: |
| 32 | Life Functions & Metabolism | Sweating when body temperature rises is an example of: |
| 33 | Life Functions & Metabolism | An unspecialized cell becoming specialized in structure and function is: |
| 34 | Life Functions & Metabolism | ATP is important because cells use it primarily to: |
| 35 | Life Functions & Metabolism | Human movement includes: |
| 36 | Life Functions & Metabolism | Reproduction at the organism level refers to: |
| 37 | Life Functions & Metabolism | Select all ways human growth can occur according to the chapter. |
| 38 | Requirements for Life | Which is NOT one of the four fundamental requirements for human survival emphasized in Chapter 1? |
| 39 | Requirements for Life | Why is oxygen deprivation especially dangerous to the brain? |
| 40 | Requirements for Life | Which nutrients are described as the primary energy-yielding nutrients? |
| 41 | Requirements for Life | Vitamins and minerals are classified as: |
| 42 | Requirements for Life | Which statement about micronutrients is correct? |
| 43 | Requirements for Life | Why is sweating less effective in very humid air? |
| 44 | Requirements for Life | Which response helps conserve core heat during cold exposure? |
| 45 | Requirements for Life | A diver develops joint pain after surfacing too rapidly. The immediate problem is: |
| 46 | Requirements for Life | At high altitude, reduced atmospheric pressure contributes to symptoms because it: |
| 47 | Requirements for Life | Which nutrient is described as the most critical because survival without it may be limited to only a few days? |
| 48 | Homeostasis | Homeostasis refers to: |
| 49 | Homeostasis | A physiological value around which a normal range fluctuates is called a: |
| 50 | Homeostasis | In a feedback loop, the component that detects a physiological value is the: |
| 51 | Homeostasis | In a feedback loop, the component that compares a value with the normal range is the: |
| 52 | Homeostasis | In a feedback loop, the structure that carries out a corrective change is the: |
| 53 | Homeostasis | Which sequence best represents negative feedback? |
| 54 | Homeostasis | Which response would help reduce elevated core body temperature? |
| 55 | Homeostasis | Which response would help defend against excessive cold? |
| 56 | Homeostasis | Negative feedback differs from positive feedback because negative feedback: |
| 57 | Homeostasis | Which is a normal example of positive feedback? |
| 58 | Homeostasis | Blood clotting can involve positive feedback because: |
| 59 | Homeostasis | A receptor detects high blood glucose, signaling causes tissues to remove glucose, and the signal diminishes as glucose falls. This is: |
| 60 | Homeostasis | Select all statements that describe negative feedback. |
| 61 | Anatomical Terminology | In anatomical position, the palms face: |
| 62 | Anatomical Terminology | A person lying face down is: |
| 63 | Anatomical Terminology | A person lying face up is: |
| 64 | Anatomical Terminology | The heart is ___ to the lungs. |
| 65 | Anatomical Terminology | The skin is ___ to skeletal muscle. |
| 66 | Anatomical Terminology | The brain is ___ to the skull. |
| 67 | Anatomical Terminology | The elbow is ___ to the wrist. |
| 68 | Anatomical Terminology | The wrist is ___ to the elbow. |
| 69 | Anatomical Terminology | The sternum is ___ to the vertebral column. |
| 70 | Anatomical Terminology | The vertebral column is ___ to the sternum. |
| 71 | Anatomical Terminology | The nose is ___ to the ears. |
| 72 | Anatomical Terminology | The ears are ___ to the nose. |
| 73 | Anatomical Terminology | The head is ___ to the abdomen. |
| 74 | Anatomical Terminology | The pelvis is ___ to the abdomen. |
| 75 | Anatomical Terminology | Which plane divides the body into anterior and posterior portions? |
| 76 | Anatomical Terminology | Which plane divides the body into superior and inferior portions? |
| 77 | Anatomical Terminology | Which plane divides the body into right and left portions? |
| 78 | Anatomical Terminology | A plane exactly through the midline creating equal right and left halves is: |
| 79 | Anatomical Terminology | A sagittal section producing unequal right and left portions is: |
| 80 | Anatomical Terminology | A plane that intersects the body at an angle is: |
| 81 | Anatomical Terminology | The brachial region refers to the: |
| 82 | Anatomical Terminology | The antebrachial region refers to the: |
| 83 | Anatomical Terminology | The crural region refers to the portion of the lower limb between the: |
| 84 | Body Cavities & Regions | The dorsal body cavity includes the: |
| 85 | Body Cavities & Regions | The ventral body cavity includes the: |
| 86 | Body Cavities & Regions | The diaphragm separates the: |
| 87 | Body Cavities & Regions | The heart is located in the: |
| 88 | Body Cavities & Regions | The brain is housed within the: |
| 89 | Body Cavities & Regions | The spinal cord is housed within the: |
| 90 | Body Cavities & Regions | The serous membrane layer directly covering an organ is the: |
| 91 | Body Cavities & Regions | The serous membrane layer lining the wall of a body cavity is the: |
| 92 | Body Cavities & Regions | Which serous membrane is associated with the lungs? |
| 93 | Body Cavities & Regions | Which serous membrane is associated with the heart? |
| 94 | Body Cavities & Regions | Which serous membrane is associated with several abdominopelvic organs? |
| 95 | Body Cavities & Regions | The major function of serous fluid is to: |
| 96 | Body Cavities & Regions | The central superior abdominal region above the umbilical region is the: |
| 97 | Body Cavities & Regions | The four abdominal quadrants are formed by lines intersecting at the: |
| 98 | Medical Imaging | Which imaging technique uses high-energy electromagnetic radiation and is especially useful for dense structures such as bone? |
| 99 | Medical Imaging | Computed tomography (CT) creates sectional images primarily by combining: |
| 100 | Medical Imaging | Which imaging method uses strong magnetic fields and radio waves rather than X-rays? |
| 101 | Medical Imaging | Which imaging method is especially suited to showing physiologic activity and areas of high glucose use? |
| 102 | Medical Imaging | Which imaging method is commonly used during pregnancy because it uses no electromagnetic ionizing radiation? |
| 103 | Medical Imaging | Which method generally gives a much higher radiation dose than a single standard X-ray because it uses many X-ray measurements? |
| 104 | Medical Imaging | A clinician wants detailed soft-tissue sectional images without X-ray exposure. Which option best fits? |
| 105 | Medical Imaging | Select all correct imaging statements. |
| 106 | Atoms & Elements | Matter is defined as anything that: |
| 107 | Atoms & Elements | The smallest unit of an element that retains that element's distinctive properties is a(n): |
| 108 | Atoms & Elements | Atomic number equals the number of: |
| 109 | Atoms & Elements | Mass number is the sum of: |
| 110 | Atoms & Elements | Which subatomic particle has a positive charge? |
| 111 | Atoms & Elements | Which subatomic particle has a negative charge? |
| 112 | Atoms & Elements | Which subatomic particle is electrically neutral? |
| 113 | Atoms & Elements | A neutral atom has atomic number 8. How many electrons does it have? |
| 114 | Atoms & Elements | A neutral atom has atomic number 12 and mass number 25. How many neutrons does it have? |
| 115 | Atoms & Elements | Isotopes of the same element differ in their number of: |
| 116 | Atoms & Elements | Oxygen has atomic number 8. Which statement must be true for every oxygen isotope? |
| 117 | Atoms & Elements | Which four elements make up more than 95% of human body mass? |
| 118 | Electron Shells & Valence | An electron shell is best described as: |
| 119 | Electron Shells & Valence | How many electrons can the first electron shell hold in the simplified model used in this chapter? |
| 120 | Electron Shells & Valence | How many electrons can the second electron shell hold in the simplified model emphasized in this chapter? |
| 121 | Electron Shells & Valence | The valence shell is: |
| 122 | Electron Shells & Valence | Why is 'the outer shell always has eight electrons' incorrect? |
| 123 | Electron Shells & Valence | A neutral magnesium atom has 12 electrons. In the chapter's simplified shell model, its arrangement is: |
| 124 | Electron Shells & Valence | Why does magnesium tend to lose two electrons rather than gain six? |
| 125 | Electron Shells & Valence | When magnesium loses two electrons, it becomes: |
| 126 | Electron Shells & Valence | An atom with electron arrangement 2 &#124; 8 &#124; 1 would most simply become stable by: |
| 127 | Electron Shells & Valence | An atom with electron arrangement 2 &#124; 7 would tend toward a full valence shell by: |
| 128 | Electron Shells & Valence | An atom with electron arrangement 2 &#124; 6 needs how many additional electrons to reach an octet? |
| 129 | Electron Shells & Valence | An atom with electron arrangement 2 &#124; 8 has: |
| 130 | Electron Shells & Valence | A neutral atom changes from 2 &#124; 8 &#124; 2 to 2 &#124; 8. What happened? |
| 131 | Electron Shells & Valence | A neutral atom changes from 2 &#124; 7 to 2 &#124; 8. What most likely happened? |
| 132 | Electron Shells & Valence | A positively charged ion is a: |
| 133 | Electron Shells & Valence | A negatively charged ion is an: |
| 134 | Electron Shells & Valence | If an atom loses electrons, its charge becomes: |
| 135 | Electron Shells & Valence | If an atom gains electrons, its charge becomes: |
| 136 | Electron Shells & Valence | Why is neon relatively unreactive in the chapter's shell model? |
| 137 | Electron Shells & Valence | Hydrogen differs from most atoms in the octet rule discussion because its first shell is full with: |
| 138 | Electron Shells & Valence | Select all true statements about valence electrons and stability. |
| 139 | Chemical Bonds | An ionic bond is primarily the attraction between: |
| 140 | Chemical Bonds | A covalent bond forms when atoms: |
| 141 | Chemical Bonds | In NaCl formation, sodium commonly becomes Na⁺ because it: |
| 142 | Chemical Bonds | In NaCl formation, chlorine commonly becomes Cl⁻ because it: |
| 143 | Chemical Bonds | A water molecule is polar because: |
| 144 | Chemical Bonds | A hydrogen bond between water molecules is: |
| 145 | Chemical Bonds | Which is a molecule but not a compound? |
| 146 | Chemical Bonds | A salt crystal consists mainly of: |
| 147 | Chemical Bonds | Which statement about covalent bonds is correct? |
| 148 | Chemical Reactions & Enzymes | The substances entering a chemical reaction are: |
| 149 | Chemical Reactions & Enzymes | The substances formed by a chemical reaction are: |
| 150 | Chemical Reactions & Enzymes | The law of conservation of mass means: |
| 151 | Chemical Reactions & Enzymes | A reaction that joins smaller components into a larger product is a: |
| 152 | Chemical Reactions & Enzymes | A reaction that breaks a larger molecule into smaller components is a: |
| 153 | Chemical Reactions & Enzymes | AB + CD → AD + CB is best classified as a(n): |
| 154 | Chemical Reactions & Enzymes | Within a tolerable range, increasing temperature generally makes chemical reactions: |
| 155 | Chemical Reactions & Enzymes | Increasing reactant concentration generally increases reaction rate because: |
| 156 | Chemical Reactions & Enzymes | Increasing pressure in a confined reaction mixture can speed reactions mainly by: |
| 157 | Chemical Reactions & Enzymes | Enzymes speed reactions primarily by: |
| 158 | Chemical Reactions & Enzymes | A substance that increases reaction rate without being permanently changed is a: |
| 159 | Chemical Reactions & Enzymes | The reactant that binds to an enzyme is the: |
| 160 | Chemical Reactions & Enzymes | The region of an enzyme where a substrate binds is the: |
| 161 | Chemical Reactions & Enzymes | Enzyme specificity is largely explained by: |
| 162 | Chemical Reactions & Enzymes | An enzyme is heated enough to lose its functional shape. The most immediate consequence is: |
| 163 | Reaction Rates | Select all changes that generally increase chemical reaction rate. |
| 164 | Water & Mixtures | Water is the body's major: |
| 165 | Water & Mixtures | Why does water dissolve many ionic and polar substances? |
| 166 | Water & Mixtures | Synovial fluid demonstrates water's role mainly as a: |
| 167 | Water & Mixtures | Cerebrospinal fluid demonstrates water's role mainly in: |
| 168 | Water & Mixtures | Water helps stabilize body temperature because it: |
| 169 | Water & Mixtures | During dehydration synthesis, water is generally: |
| 170 | Water & Mixtures | During hydrolysis, water is generally: |
| 171 | Water & Mixtures | A homogeneous liquid mixture in which a solute remains evenly distributed is a: |
| 172 | Water & Mixtures | A cloudy liquid in which clumps scatter light but remain dispersed is a: |
| 173 | Water & Mixtures | A liquid mixture whose heavier particles eventually settle is a: |
| 174 | Water & Mixtures | A substance that dissolves another substance is the: |
| 175 | Water & Mixtures | A substance dissolved in a solvent is the: |
| 176 | Water & Mixtures | Hydrophilic substances tend to: |
| 177 | Water & Mixtures | Hydrophobic substances tend to: |
| 178 | Water & Mixtures | Select all roles of water emphasized in Chapter 2. |
| 179 | Acids, Bases & pH | An acid is a substance that releases ___ in solution. |
| 180 | Acids, Bases & pH | A base can reduce acidity by: |
| 181 | Acids, Bases & pH | A strong acid differs from a weak acid because a strong acid: |
| 182 | Acids, Bases & pH | A solution with pH 7 is: |
| 183 | Acids, Bases & pH | Compared with pH 7, pH 6 has: |
| 184 | Acids, Bases & pH | Compared with pH 8, pH 6 has: |
| 185 | Acids, Bases & pH | Which solution is more acidic? |
| 186 | Acids, Bases & pH | Normal blood pH is approximately: |
| 187 | Acids, Bases & pH | If blood pH falls, an appropriate buffer can help by: |
| 188 | Acids, Bases & pH | If blood pH rises, an appropriate buffer can help by: |
| 189 | Acids, Bases & pH | A blood pH of 7.48 is: |
| 190 | Acids, Bases & pH | Prolonged severe vomiting can contribute to metabolic alkalosis because it can cause loss of: |
| 191 | Acids, Bases & pH | Acidosis means body fluids are: |
| 192 | Acids, Bases & pH | Alkalosis means body fluids are: |
| 193 | Organic Compounds | An organic compound, as defined in this chapter, contains: |
| 194 | Organic Compounds | Which is an inorganic compound despite containing carbon? |
| 195 | Organic Compounds | Carbon commonly forms stable organic molecules because it readily: |
| 196 | Organic Compounds | A monomer is: |
| 197 | Organic Compounds | Polymers are split into monomers by: |
| 198 | Organic Compounds | Monomers are commonly joined into polymers by: |
| 199 | Carbohydrates & Lipids | The monomers of carbohydrates are: |
| 200 | Carbohydrates & Lipids | Glucose, fructose, and galactose are: |
| 201 | Carbohydrates & Lipids | Ribose and deoxyribose are: |
| 202 | Carbohydrates & Lipids | Sucrose, lactose, and maltose are: |
| 203 | Carbohydrates & Lipids | The storage polymer of glucose in human tissues is: |
| 204 | Carbohydrates & Lipids | The polysaccharide in plant cell walls that humans cannot digest is: |
| 205 | Carbohydrates & Lipids | Starch is best described as: |
| 206 | Carbohydrates & Lipids | A glycosidic bond joins: |
| 207 | Carbohydrates & Lipids | A triglyceride consists of: |
| 208 | Carbohydrates & Lipids | A phospholipid consists of: |
| 209 | Carbohydrates & Lipids | Phospholipids are useful in cell membranes because they contain: |
| 210 | Carbohydrates & Lipids | Saturated fatty acid chains are generally: |
| 211 | Carbohydrates & Lipids | Unsaturated fatty acid chains are generally: |
| 212 | Carbohydrates & Lipids | Sterols such as cholesterol are characterized by: |
| 213 | Carbohydrates & Lipids | Prostaglandins are derived from: |
| 214 | Carbohydrates & Lipids | Select all correct statements about carbohydrates and lipids. |
| 215 | Proteins | The monomers of proteins are: |
| 216 | Proteins | A peptide bond links: |
| 217 | Proteins | Protein primary structure refers to: |
| 218 | Proteins | An alpha helix or beta-pleated sheet is an example of: |
| 219 | Proteins | Protein tertiary structure refers to: |
| 220 | Proteins | Quaternary structure occurs when: |
| 221 | Proteins | Denaturation can cause a protein to lose function because it changes the protein's: |
| 222 | Proteins | Hemoglobin is used in the chapter as an example of a protein with: |
| 223 | Proteins | Amino acids all contain both: |
| 224 | Proteins | The variable part that distinguishes amino acids from one another is the: |
| 225 | Proteins | Select all correct protein statements. |
| 226 | DNA, RNA & ATP | Every nucleotide contains: |
| 227 | DNA, RNA & ATP | The sugar in DNA is: |
| 228 | DNA, RNA & ATP | The sugar in RNA is: |
| 229 | DNA, RNA & ATP | Which base is found in DNA but not RNA? |
| 230 | DNA, RNA & ATP | Which base is found in RNA but not DNA? |
| 231 | DNA, RNA & ATP | The two DNA strands are joined across their bases primarily by: |
| 232 | DNA, RNA & ATP | ATP consists of: |
| 233 | DNA, RNA & ATP | Hydrolysis of ATP typically produces: |
| 234 | DNA, RNA & ATP | Phosphorylation means: |
| 235 | DNA, RNA & ATP | DNA is described structurally as a: |
| 236 | DNA, RNA & ATP | Messenger RNA helps carry genetic instructions from DNA toward: |
| 237 | DNA, RNA & ATP | Adenine and guanine are classified as: |
| 238 | DNA, RNA & ATP | Cytosine, thymine, and uracil are classified as: |
| 239 | DNA, RNA & ATP | Select all correct statements about DNA, RNA, and ATP. |

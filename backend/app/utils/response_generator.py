from enum import Enum
from typing import Dict, Optional, List
from datetime import datetime
import random
import re
import logging

# Initialize logger
logger = logging.getLogger(__name__)

class ConversationState(Enum):
    INITIAL = 1
    FOLLOW_UP = 2
    CRISIS = 3

class AIResponseGenerator:
    # ... rest of the class implementation ...
    
    def _analyze_sentiment(self, message: str) -> float:
        """Analyze message sentiment with enhanced word lists"""
        positive = ["hope", "better", "improving", "progress", "happy", "relief"]
        negative = ["hopeless", "worthless", "terrible", "awful", "hate", "despair"]
        
        words = re.findall(r'\w+', message.lower())
        pos = sum(1 for w in words if w in positive)
        neg = sum(1 for w in words if w in negative)
        total = pos + neg
        
        if total == 0:
            return 0.0
        return (pos - neg) / total

    # Add input validation to generate_response
    def generate_response(self, message: str, intent: Optional[str] = None) -> str:
        if not message or not isinstance(message, str):
            return "Could you please share more about how you're feeling?"
        
class AIResponseGenerator:
    def __init__(self, intent_manager=None):
        """Advanced mental health response generator with contextual awareness"""
        self.responses = self._initialize_responses()
        self.resources = self._initialize_resources()
        self.crisis_keywords = self._initialize_crisis_keywords()
        self._setup_conversation_tracking()
        self.intent_manager = intent_manager

    def _initialize_responses(self) -> Dict:
        """Initialize comprehensive response library with actionable strategies"""
        return {
            "depression": {
                "initial": [
                    "I hear the pain in your words. When feeling this way, try breaking tasks into tiny steps. Would you like to share more?",
                    "Depression can feel overwhelming. Right now, focus on one small thing you can do today. Want to talk about it?",
                    "The weight of depression can make everything feel heavy. Remember to be gentle with yourself today.",
                    "I'm sorry you're feeling this way. Depression can distort our thinking - what's one small thing that usually brings you comfort?",
                    "You're not alone in this struggle. Many find it helpful to focus on just the next hour rather than the whole day.",
                    "Depression can make even small tasks feel impossible. Would you like to brainstorm some manageable steps together?",
                    "I hear how hard this is for you. Sometimes just acknowledging the difficulty is an important first step.",
                    "When depression feels heavy, it can help to name what you're experiencing. Would you describe it more like a weight, a fog, or something else?",
                    "Thank you for sharing this with me. Depression can be isolating, but you're reaching out - that takes strength.",
                    "I want you to know that what you're feeling is valid, even if depression tells you otherwise."
                ],
                "follow_up": {
                    "duration": [
                        "How long have you felt this way? Tracking small wins helps - even getting up is an achievement.",
                        "Is this recent or ongoing? Noticing patterns helps prepare for tough times.",
                        "Has this been a persistent feeling or something that comes and goes? Understanding the pattern can help.",
                        "When did you first notice these feelings? Sometimes recognizing the timeline helps us see it as temporary.",
                        "Have you experienced periods like this before? Many people find their depression follows certain cycles.",
                        "Would you say this is a new experience or something familiar? Both can be challenging in different ways."
                    ],
                    "triggers": [
                        "What makes these feelings stronger? Identifying triggers helps build coping strategies.",
                        "What typically worsens these feelings? Recognizing them is the first step to managing.",
                        "Have you noticed any situations, times of day, or thoughts that intensify these feelings?",
                        "Does anything in particular tend to make these feelings more intense? Even small observations can be helpful.",
                        "What circumstances seem to make these feelings worse? Sometimes patterns aren't obvious at first.",
                        "When do you find these feelings are most intense? Morning, evening, or certain situations?"
                    ],
                    "impact": [
                        "How has this affected your daily life? Be gentle with yourself - basic tasks can feel hard.",
                        "How has this impacted your routine? Adjusting expectations temporarily can reduce pressure.",
                        "What parts of your life are most affected right now? Work, relationships, or self-care?",
                        "Have you noticed changes in your sleep, appetite, or energy levels with these feelings?",
                        "What activities have become more difficult recently? Even small changes matter.",
                        "How is this affecting your relationships or responsibilities? Depression often impacts these areas."
                    ],
                    "coping": [
                        "When you've felt this before, what helped slightly? Building on small successes creates momentum.",
                        "Have any strategies provided relief? Try the 5-minute rule - commit to an activity for just 5 minutes.",
                        "What has helped in the past, even just a little? Sometimes we forget what's worked before.",
                        "Have you found any activities that provide temporary relief? Even brief respites matter.",
                        "What small things have made these feelings slightly more manageable? A shower, fresh air, or certain music?",
                        "Have you discovered any unexpected things that help? Sometimes solutions come from surprising places."
                    ]
                },
                "validation": [
                    "This sounds incredibly hard. Remember depression lies - your worth isn't defined by current struggles.",
                    "Living with depression takes strength. Reaching out takes courage when everything feels heavy.",
                    "What you're experiencing is real and valid, even if depression makes you doubt that.",
                    "Depression can make you feel alone, but many people understand this struggle. You're not isolated.",
                    "You're showing remarkable strength by facing these feelings and reaching out for support.",
                    "It's okay to feel this way. Depression doesn't mean you're weak - it means you've been strong too long.",
                    "Your feelings make sense given what you're experiencing, even if they're painful.",
                    "Depression can distort reality. The way you feel right now isn't a true measure of your worth.",
                    "You're carrying a heavy burden, but you don't have to carry it alone. That's why you reached out.",
                    "Many people in your situation would feel similarly. Your reaction is understandable."
                ],
                "professional": [
                    "A therapist could help develop personalized tools. Want info about professional support?",
                    "Depression often responds well to treatment. Open to exploring support options?",
                    "Professional help can provide strategies tailored to your specific needs. Interested in learning more?",
                    "There are effective treatments for depression that could help you feel better. Would you like information?",
                    "A mental health professional could offer additional support. Would you like resources to find help?",
                    "Therapy can provide new perspectives and coping strategies. Would you like guidance on finding a therapist?",
                    "Medication combined with therapy helps many people with depression. Want to discuss treatment options?",
                    "There are different types of therapy that can be very effective for depression. Interested in learning more?",
                    "Professional support could help you develop a personalized plan. Would you like some guidance?",
                    "Many find that working with a therapist accelerates their recovery. Open to exploring this option?"
                ],
                "actionable": [
                    "Right now, write down one tiny thing you can do today - even drinking water or opening a window.",
                    "When depressed, try the '5 senses' exercise: Notice one thing you see, hear, touch, smell, and taste.",
                    "Try the '5-minute rule': Pick one small activity and commit to just 5 minutes of it.",
                    "Set a timer for 2 minutes and do one small thing - like straightening your sheets or wiping a surface.",
                    "Try 'behavioral activation': Do one small positive activity, no matter how small it seems.",
                    "Write down three things you're grateful for, no matter how small. This can help shift perspective.",
                    "Step outside for just one minute. Fresh air can sometimes provide a slight shift in perspective.",
                    "Try the 'dopamine menu' technique: List small pleasurable activities and pick one to try.",
                    "Practice self-compassion: Place a hand on your heart and say 'This is hard, and I'm doing my best.'",
                    "Try 'opposite action': If you feel like isolating, text one friend. If inactive, walk around the block."
                ]
            },
            "anxiety": {
                "initial": [
                    "Anxiety can feel like a false alarm. Try slow breaths: inhale 4 counts, hold 4, exhale 6. Want to talk about triggers?",
                    "I hear your worry. Place both feet flat, notice how it feels. Want to explore what's coming up?",
                    "Anxiety often makes us overestimate danger and underestimate our ability to cope. What's worrying you?",
                    "Your anxiety is trying to protect you, even if it feels overwhelming right now. Let's explore it together.",
                    "Anxiety can create loops of worrying thoughts. Sometimes naming them helps break the cycle.",
                    "I notice you're feeling anxious. Would it help to identify where in your body you feel it most?",
                    "Anxiety can make thoughts race. Try this: Name 3 things you see, 2 you hear, 1 physical sensation.",
                    "When anxiety strikes, sometimes acknowledging it helps: 'I'm feeling anxiety, and it will pass.'",
                    "Anxiety often comes in waves. Remember you've gotten through this before, even when it felt overwhelming.",
                    "Your mind is sending danger signals, but you're actually safe right now. Let's explore that together."
                ],
                "follow_up": {
                    "physical": [
                        "Noticed physical symptoms like rapid heartbeat? Place a hand on chest, breathe slowly to calm your system.",
                        "How does your body react to anxiety? Try tensing then releasing each muscle group progressively.",
                        "Where do you feel anxiety in your body? Chest, stomach, shoulders? Bringing awareness can help.",
                        "Have you noticed physical signs like sweating, trembling, or shortness of breath?",
                        "Anxiety often shows up physically. Try placing a hand where you feel it and breathe into that space.",
                        "What physical sensations accompany your anxiety? Noticing them can help you ride them out."
                    ],
                    "triggers": [
                        "What situations trigger these feelings? Identifying them helps prepare calming strategies.",
                        "Notice any anxiety patterns? Recognizing 'This is my anxiety talking' creates helpful distance.",
                        "Have you noticed specific thoughts or situations that tend to spark your anxiety?",
                        "Does your anxiety tend to focus on particular areas like health, work, or relationships?",
                        "What thoughts or scenarios tend to trigger your anxiety? Sometimes naming them reduces their power.",
                        "Are there particular times of day or situations when your anxiety is worse?"
                    ],
                    "frequency": [
                        "How often does this happen? Daily grounding exercises can build resilience over time.",
                        "Is this occasional or constant? Regular mindfulness can reduce baseline anxiety.",
                        "Would you say these feelings come in waves or are they more constant throughout the day?",
                        "How frequently do you experience these anxious feelings? Daily, weekly, or in specific situations?",
                        "Has the frequency changed recently? Sometimes tracking helps identify patterns.",
                        "Do these feelings come and go, or do they persist throughout the day?"
                    ],
                    "coping": [
                        "What has helped in the past when you've felt this anxious? Even small strategies matter.",
                        "When you've managed anxiety before, what worked for you? We can build on that.",
                        "Have you discovered any techniques that provide even temporary relief from anxiety?",
                        "What small things have helped calm your anxiety in the past? A walk, music, or calling someone?",
                        "Have you found any unexpected strategies that help with anxiety? Sometimes they're surprising.",
                        "What activities tend to soothe your anxiety, even if just slightly?"
                    ]
                },
                "grounding": [
                    "Let's try grounding: Name 3 things you see, 2 you can touch, 1 you hear. How does that feel?",
                    "When anxious, try 5-4-3-2-1: Notice 5 things around you, 4 touchable, 3 sounds, 2 smells, 1 taste.",
                    "Try the 'alphabet game': Name items around you starting with each letter to shift focus.",
                    "Count backwards from 100 by 7s - the mental effort can interrupt anxious thoughts.",
                    "Describe an everyday object in extreme detail - texture, color, weight, temperature.",
                    "Name all the colors you can see around you right now. Really notice each shade.",
                    "Try 'square breathing': inhale 4, hold 4, exhale 4, hold 4. Repeat several cycles.",
                    "List 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, 1 you can taste.",
                    "Pick a category (like 'animals') and name as many as you can in 30 seconds to shift focus.",
                    "Describe your surroundings in detail as if to someone who's never been there before."
                ],
                "validation": [
                    "Managing anxiety is exhausting. You're showing strength by facing these feelings.",
                    "Anxiety makes everything feel threatening. These feelings will pass, even when they seem permanent.",
                    "Your anxiety is real, but so is your ability to cope with it, even when it doesn't feel that way.",
                    "Anxiety can make you doubt yourself, but you're handling this better than you think.",
                    "What you're feeling is understandable. Anxiety creates very real physical and emotional responses.",
                    "You're not overreacting - anxiety creates real distress. And you're taking steps to manage it.",
                    "Many people in your situation would feel similarly anxious. Your reaction makes sense.",
                    "Anxiety can be overwhelming, and you're still here, working through it. That takes courage.",
                    "Your feelings are valid. Anxiety doesn't mean you're weak - it means you're human.",
                    "Anxiety lies to us about our capabilities. You're stronger than your anxiety tells you."
                ],
                "actionable": [
                    "Try 'box breathing': inhale 4, hold 4, exhale 4, pause 4. Repeat until calmer.",
                    "When thoughts race, write them down. Seeing them on paper can reduce their intensity.",
                    "Place both feet flat, notice the floor supporting you. Breathe deeply into your belly.",
                    "Try progressive muscle relaxation: tense then release each muscle group from toes to head.",
                    "Hold something cold (ice cube or cold drink) and focus on the sensation for grounding.",
                    "Name your anxiety: 'This is my anxiety talking, not reality.' Creates helpful distance.",
                    "Try the '5 senses' exercise: Notice something you see, hear, touch, smell, and taste.",
                    "Write down your worries then set them aside physically (close notebook, put in drawer).",
                    "Do a quick body scan: Notice areas of tension and consciously relax them.",
                    "Try 'worry postponement': Schedule 15 minutes later to worry, then return to present."
                ]
            },
            "trauma": {
                "initial": [
                    "It sounds like you've been through something difficult. You're safe here to share at your own pace.",
                    "Talking about trauma can be hard. I'm here when you're ready, with no pressure.",
                    "What you've experienced matters. You can share as much or as little as feels right.",
                    "Trauma affects everyone differently. There's no 'right' way to feel or talk about it.",
                    "You're showing courage by even considering discussing this. I'll follow your lead.",
                    "Trauma can make us feel disconnected. I want you to know you're not alone right now.",
                    "Whatever you're feeling about your experience is valid. You set the pace for this conversation.",
                    "Talking about trauma can bring up many emotions. We can pause anytime you need.",
                    "Your experience matters. Would you like to share what feels safe to discuss today?",
                    "Trauma can leave deep marks. Healing often happens in small steps when you're ready."
                ],
                "follow_up": {
                    "safety": [
                        "Do you feel physically and emotionally safe right now? Your safety is most important.",
                        "Are you in a comfortable place to discuss this? We can pause anytime.",
                        "Before we continue, check in with yourself - do you feel safe continuing?",
                        "How is your body reacting as we talk about this? Any signs of overwhelm?",
                        "Notice your breathing and body tension as we discuss this - we can adjust as needed.",
                        "Would it help to establish a 'stop signal' if this becomes too much?"
                    ],
                    "support": [
                        "Do you have supportive people who know about this? Connection helps healing.",
                        "Who in your life is aware of what you've been through? Support systems matter.",
                        "Have you been able to share this with anyone you trust? Isolation can worsen trauma.",
                        "Is there someone you can reach out to after our conversation if needed?",
                        "Who in your life makes you feel safe when discussing difficult things?",
                        "Have you found any support groups or communities that understand your experience?"
                    ],
                    "triggers": [
                        "Have you noticed things that trigger memories or strong reactions? Identifying helps.",
                        "What situations tend to bring up difficult memories or emotions?",
                        "Have you discovered any unexpected triggers? They can sometimes surprise us.",
                        "Do certain dates, places, or sensations bring up strong reactions?",
                        "Have you noticed patterns in when these memories feel most intense?",
                        "What helps you feel grounded when triggered? We can build on those strategies."
                    ],
                    "coping": [
                        "What has helped you cope when difficult memories come up?",
                        "Have you discovered any strategies that provide comfort or grounding?",
                        "When you've felt overwhelmed by memories before, what helped?",
                        "What small things help you feel safer when dealing with trauma reactions?",
                        "Have any self-care practices been particularly helpful in your healing?",
                        "What activities help you reconnect with the present when memories intrude?"
                    ]
                },
                "professional": [
                    "A trauma specialist could help process this safely. Want information about that?",
                    "Trauma therapists use proven methods for healing. Interested in exploring options?",
                    "EMDR and other trauma therapies can be very effective. Would you like resources?",
                    "Trauma-informed therapy could provide specialized support. Want help finding options?",
                    "There are therapies specifically designed for trauma recovery. Interested to learn more?",
                    "A therapist trained in trauma could help you process this at the right pace.",
                    "Somatic experiencing is one approach that helps many trauma survivors. Want information?",
                    "Group therapy with other trauma survivors can be powerful. Would you like details?",
                    "Trauma-focused CBT has helped many people. Would you like resources to learn more?",
                    "Some therapists specialize in your type of experience. Would you like help finding one?"
                ],
                "actionable": [
                    "If emotions feel overwhelming, try orienting to the present: name objects around you.",
                    "For trauma triggers, try the 'butterfly hug' - cross arms and alternately tap shoulders.",
                    "Try 'containment imagery': Imagine placing difficult memories in a secure container temporarily.",
                    "Practice grounding by noticing your feet on the floor and the chair supporting you.",
                    "Create a 'safe space' in your mind you can visualize when feeling overwhelmed.",
                    "Try the 5-4-3-2-1 technique to reconnect with the present moment when triggered.",
                    "Keep a comfort object nearby (stone, photo) to touch when needing grounding.",
                    "Develop a 'rescue phrase' to remind yourself you're safe now when memories arise.",
                    "Practice slow breathing with longer exhales to calm your nervous system.",
                    "Create a playlist of soothing music for moments when you need emotional regulation."
                ]
            },
            "self_harm": {
                "initial": [
                    "I hear your pain. Let's focus on keeping you safe right now. You matter deeply.",
                    "You're not alone in this. Let's find ways to get through this difficult moment together.",
                    "I want you to know that help is available and recovery is possible.",
                    "You deserve care and support, especially when you're feeling this way.",
                    "This pain you're feeling is real, and so is the possibility of feeling better.",
                    "I'm here with you in this difficult moment. Let's focus on your safety.",
                    "You're reaching out, which shows part of you wants help. Let's listen to that part.",
                    "These feelings are temporary, even when they feel endless right now.",
                    "You don't have to face this alone. Let's think about who could support you right now.",
                    "However you're feeling, you deserve care and compassion, especially now."
                ],
                "safety": [
                    "Is there someone you can reach out to right now? You deserve support.",
                    "Has anything helped in past when you felt this way? Let's build on that.",
                    "What's one small thing that might help you feel slightly safer right now?",
                    "Do you have a safe space you can go to until these feelings pass?",
                    "Would it help to remove or distance yourself from anything you might use to harm?",
                    "Is there a friend or family member who could stay with you right now?",
                    "Have you made a safety plan before? Let's review or create one now.",
                    "What distractions have helped in the past when urges were strong?",
                    "Can you think of one reason to wait before acting on these urges?",
                    "Would making a cup of tea or getting a glass of water help create a pause?"
                ],
                "professional": [
                    "I strongly encourage connecting with a mental health professional about this.",
                    "This is important to discuss with a therapist who can provide proper support.",
                    "A counselor could help you develop healthier coping strategies for these feelings.",
                    "There are professionals who specialize in helping people with self-harm urges.",
                    "Therapy can help address the underlying causes of these feelings. Would you consider it?",
                    "A mental health professional could help you build a personalized safety plan.",
                    "There are treatments that can reduce self-harm urges over time. Would you like information?",
                    "Working with a professional could help you develop alternative coping methods.",
                    "Therapy can provide support in understanding and managing these difficult feelings.",
                    "Many people find professional help invaluable in overcoming self-harm urges."
                ],
                "actionable": [
                    "If urges feel strong, try holding ice cubes - the sensation can help ground you.",
                    "Try drawing on your skin with red marker where you might self-harm as an alternative.",
                    "Snap a rubber band against your wrist as a less harmful alternative to self-injury.",
                    "Try scribbling intensely on paper to release emotions without self-harm.",
                    "Take a very cold shower to help shift intense emotions and urges.",
                    "Write down what you're feeling in detail, then tear the paper into small pieces.",
                    "Try intense exercise like running in place or pushups to release tension safely.",
                    "Scream into a pillow to release emotional pain physically.",
                    "Draw or paint your feelings instead of harming yourself.",
                    "Create a 'distraction box' with items that engage your senses (textures, smells)."
                ]
            },
            "suicide_risk": {
                "immediate": [
                    "I'm deeply concerned for your safety. Please call 988 (Suicide Prevention Lifeline) right now.",
                    "You're not alone. Text HOME to 741741 (Crisis Text Line) immediately for support.",
                    "Your life matters tremendously. Please call emergency services or 988 right now.",
                    "I care about your safety. Would you be willing to call 988 with me right now?",
                    "You're important and deserve help. Please reach out to a crisis line immediately.",
                    "Your pain is real and so is hope for relief. Please call 988 right now for support.",
                    "There are people who want to help you through this. Will you call 988 with me?",
                    "You matter more than you can see right now. Please contact a crisis line immediately.",
                    "Help is available right now. Would you be willing to call 988 together?",
                    "Your safety is most important. Please reach out to emergency services or 988 now."
                ],
                "follow_up": [
                    "Have you had thoughts about how you might harm yourself? Please reach out for help now.",
                    "Is there someone who can stay with you right now? You shouldn't be alone with these feelings.",
                    "Have you made any plans? Please tell someone who can help keep you safe immediately.",
                    "Do you have access to means? Your safety is most important right now - can you remove them?",
                    "Would you be willing to call someone who can help right now? You don't have to do this alone.",
                    "Have you felt this way before? Remember that feelings pass, even when they feel permanent.",
                    "Is there a professional you can contact immediately? Your safety is the priority.",
                    "Would you be willing to go to an emergency room? They can help keep you safe.",
                    "Have you told anyone else how you're feeling? Please reach out to someone now.",
                    "Can you think of one reason to wait before acting? Please call for help in this moment."
                ]
            },
            "greeting": [
                "Hello, I'm here to listen without judgment. How are you feeling in this moment?",
                "Welcome. I'm here to support you. What's on your mind today?",
                "Hi there. I'm here to listen. What would you like to talk about today?",
                "Hello. This is a safe space to share what's on your heart and mind.",
                "Welcome. However you're feeling today, I'm here to listen and support you.",
                "Hi. I'm here to offer support without judgment. What brings you here today?",
                "Hello. However you're feeling right now is okay. What would you like to share?",
                "Welcome. You're not alone in whatever you're experiencing. What's on your mind?",
                "Hi there. However you're feeling today is valid. Would you like to share?",
                "Hello. I'm here to listen with care and compassion. What would you like to talk about?"
            ],
            "general": [
                "I want to understand what you're experiencing. Try taking a slow breath before sharing more.",
                "Thank you for sharing. As we talk, check in with your body - maybe adjust your posture.",
                "I hear you. Would you like to explore this feeling more deeply?",
                "Thank you for trusting me with this. What else comes up as you share?",
                "I'm listening carefully. What would help you feel most supported right now?",
                "That sounds challenging. Would you like to explore coping strategies together?",
                "I appreciate you sharing this. How has this been affecting your daily life?",
                "Thank you for being open. What do you need most in this moment?",
                "I hear how this is affecting you. What would feel helpful to discuss right now?",
                "That sounds difficult. Would it help to explore this from a different angle?"
            ],
            "positive": [
                "I'm glad you're feeling better! What helped this improvement? Noticing what works helps.",
                "That's progress! Consider writing down what helped - creates a personal toolkit.",
                "That's wonderful to hear! What do you think contributed to this positive shift?",
                "I'm so glad you're feeling some relief. What would you like to build on from this?",
                "That's great progress! What have you learned about what helps you feel better?",
                "I'm happy to hear you're feeling better! How can you build on this positive moment?",
                "That's a significant improvement! What would help maintain this positive trend?",
                "Wonderful! What was different about this time that led to feeling better?",
                "I'm so pleased you're experiencing some relief. What insights can you take from this?",
                "That's fantastic! What would help you continue this positive direction?"
            ],
            "closing": [
                "Our time is ending, but remember: [personalized tip]. Support is always available.",
                "Need to wrap up now. Try [relevant technique] if needed later. You're not alone.",
                "We need to conclude, but remember you can reach out again anytime you need support.",
                "I have to end our conversation now, but please know help is always available when you need it.",
                "We're out of time, but remember the coping strategies we discussed. You've got this.",
                "I need to wrap up now. Remember the resources we discussed if you need more support.",
                "Our time is ending, but your healing journey continues. You're stronger than you think.",
                "We have to conclude now, but remember: progress isn't linear. Be gentle with yourself.",
                "I need to end our conversation, but please reach out to other supports if needed.",
                "We're out of time, but remember: small steps forward still count. Keep going."
            ]
        }

    def _initialize_resources(self) -> Dict:
        """Initialize detailed mental health resources"""
        return {
            "depression": [
                "National Depression Hotline: 1-800-273-TALK (8255) 24/7",
                "Depression Toolkit: www.depressiontoolkit.org (self-help tools)",
                "Behavioral Activation Guide: www.getselfhelp.co.uk/docs/BA_Plan.pdf",
                "Daily Mood Tracker: www.moodtools.org (free app)",
                "Online CBT Program: www.moodgym.com.au (evidence-based)",
                "Depression Support Community: www.depressionforums.org",
                "Guided Meditation for Depression: www.headspace.com/depression",
                "Free Therapy Worksheets: www.therapistaid.com/therapy-worksheets/depression",
                "Depression Recovery Stories: www.blurtitout.org",
                "Local Support Groups: www.nami.org/Support-Education/Support-Groups"
            ],
            "anxiety": [
                "Anxiety Canada: www.anxietycanada.com (free courses)",
                "DARE Anxiety App: www.dareresponse.com (evidence-based help)",
                "Grounding Techniques: www.getselfhelp.co.uk/docs/Grounding.pdf",
                "Anxiety Hotline: 1-800-950-NAMI (6264)",
                "CBT for Anxiety: www.anxietycanada.com/articles/cbt-strategies/",
                "Breathing Exercises: www.helpguide.org/articles/stress/relaxation-techniques.htm",
                "Anxiety Support Community: www.anxietycommunity.com",
                "Progressive Muscle Relaxation Guide: www.uhs.umich.edu/muscle-relaxation",
                "Anxiety Workbook: www.therapistaid.com/therapy-guide/anxiety-workbook",
                "Local Anxiety Support: www.adaa.org/find-help/support/community-resources"
            ],
            "crisis": [
                "Suicide Prevention Lifeline: Call/text 988 24/7",
                "Crisis Text Line: Text HOME to 741741",
                "IMAlive Chat: www.imalive.org (trained listeners)",
                "Veterans Crisis Line: 988 then press 1",
                "Trevor Project (LGBTQ+): 1-866-488-7386",
                "Trans Lifeline: 1-877-565-8860",
                "National Domestic Violence Hotline: 1-800-799-SAFE (7233)",
                "SAMHSA Treatment Locator: 1-800-662-HELP (4357)",
                "Crisis Chat: www.crisischat.org",
                "Local Mobile Crisis Teams: Check your county mental health department"
            ],
            "therapy": [
                "Psychology Today: www.psychologytoday.com (search therapists)",
                "Open Path: www.openpathcollective.org ($30-60 sessions)",
                "BetterHelp: www.betterhelp.com (online counseling)",
                "Sliding Scale Therapy: www.inclusivetherapists.com",
                "University Counseling Centers: Often offer low-cost sessions",
                "Community Mental Health Centers: Provide low-income options",
                "Group Therapy Options: Often more affordable than individual",
                "Employee Assistance Programs: Check if your employer offers sessions",
                "Online Therapy Options: www.talkspace.com or www.cerebral.com",
                "Local Training Clinics: Often offer reduced-fee sessions"
            ]
        }

   

    def _initialize_crisis_keywords(self) -> Dict:
        """Initialize crisis keyword detection system"""
        return {
            "immediate": {
                "keywords": ["kill myself", "end my life", "suicide plan", "want to die"],
                "threshold": 1
            },
            "concerning": {
                "keywords": ["can't go on", "no reason to live", "better off dead", "don't want to exist"],
                "threshold": 2
            }
        }

    def _setup_conversation_tracking(self):
        """Initialize conversation tracking system"""
        self.conversation_context = {
            "current_topic": None,
            "state": ConversationState.INITIAL,
            "user_info": {
                "name": None,
                "therapy_history": None,
                "medication": None,
                "support_system": None
            },
            "message_history": [],
            "sentiment_trend": [],
            "start_time": datetime.now()
        }

    def generate_response(self, message: str, intent: Optional[str] = None) -> str:
        """
        Generate contextually appropriate mental health response
        Args:
            message: User's input message
            intent: Predetermined intent from NLP model
        Returns:
            Generated response with support strategies
        """
        logger.debug(f"Generating response for intent: {intent}, message: {message[:50]}...")
        self._update_conversation_context(message)
        
        crisis_level = self._assess_crisis_risk(message)
        if crisis_level:
            return self._handle_crisis_situation(crisis_level)
            
        if not intent:
            intent = self._determine_intent(message)
            
        return self._generate_contextual_response(intent, message)

    def _update_conversation_context(self, message: str):
        """Update conversation tracking with new message"""
        self.conversation_context["message_history"].append(message)
        sentiment = self._analyze_sentiment(message)
        self.conversation_context["sentiment_trend"].append(sentiment)
        self._extract_user_info(message)

    def _assess_crisis_risk(self, message: str) -> Optional[str]:
        """Check for crisis language with enhanced detection"""
        message_lower = message.lower()
        
        for level, data in self.crisis_keywords.items():
            count = sum(1 for kw in data["keywords"] if kw in message_lower)
            if count >= data["threshold"]:
                return level
        return None

    def _handle_crisis_situation(self, level: str) -> str:
        """Generate immediate crisis response with resources"""
        self.conversation_context["state"] = ConversationState.CRISIS
        
        if level == "immediate":
            response = random.choice(self.responses["suicide_risk"]["immediate"])
            resources = "\n".join(self.resources["crisis"])
            return f"{response}\n\nImmediate help:\n{resources}"
        else:
            response = random.choice(self.responses["self_harm"]["initial"])
            follow_up = random.choice(self.responses["self_harm"]["safety"])
            return f"{response}\n\n{follow_up}"

    def _determine_intent(self, message: str) -> str:
        """Determine intent from message content"""
        if self._assess_crisis_risk(message):
            return "suicide_risk"
            
        topic_keywords = {
            "depression": ["depress", "hopeless", "worthless", "empty"],
            "anxiety": ["anxious", "panic", "overwhelmed", "nervous"],
            "trauma": ["trauma", "abuse", "PTSD", "flashback"],
            "self_harm": ["cutting", "self-harm", "hurt myself"],
            "greeting": ["hello", "hi", "hey", "start"]
        }
        
        message_lower = message.lower()
        for intent, keywords in topic_keywords.items():
            if any(kw in message_lower for kw in keywords):
                return intent
                
        if self.conversation_context["sentiment_trend"]:
            avg_sentiment = sum(self.conversation_context["sentiment_trend"]) / len(self.conversation_context["sentiment_trend"])
            if avg_sentiment > 0.3:
                return "positive"
                
        return "general"

    def _generate_contextual_response(self, intent: str, message: str) -> str:
        """Generate response with immediate coping strategies"""
        if intent not in self.responses:
            intent = "general"
            
        if random.random() < 0.7 and "actionable" in self.responses[intent]:
            response = random.choice(self.responses[intent]["actionable"])
        elif self.conversation_context["state"] == ConversationState.INITIAL:
            response = self._get_initial_response(intent)
        elif self.conversation_context["state"] == ConversationState.FOLLOW_UP:
            response = self._get_follow_up_response(intent)
        else:
            response = random.choice(self.responses[intent])
            
        response = self._personalize_response(response)
        
        if self._should_include_resources(intent):
            response += self._get_resources(intent)
            
        return response

    def _get_initial_response(self, intent: str) -> str:
        """Get initial response with topic setup"""
        self.conversation_context["current_topic"] = intent
        self.conversation_context["state"] = ConversationState.FOLLOW_UP
        
        if "initial" in self.responses[intent]:
            return random.choice(self.responses[intent]["initial"])
        return random.choice(self.responses[intent])

    def _get_follow_up_response(self, intent: str) -> str:
        """Get follow-up response with deeper exploration"""
        if "follow_up" in self.responses[intent]:
            for follow_up_type, questions in self.responses[intent]["follow_up"].items():
                if follow_up_type not in self.conversation_context["user_info"]:
                    return random.choice(questions)
                    
        if "validation" in self.responses[intent] and random.random() > 0.6:
            return random.choice(self.responses[intent]["validation"])
            
        return random.choice(self.responses[intent])

    def _personalize_response(self, response: str) -> str:
        """Personalize response with user information"""
        if self.conversation_context["user_info"]["name"]:
            name = self.conversation_context["user_info"]["name"]
            response = response.replace("you", f"you, {name}", 1)
        return response

    def _should_include_resources(self, intent: str) -> bool:
        """Determine if resources should be included"""
        if intent in ["suicide_risk", "self_harm"]:
            return True
        return random.random() < 0.6 and intent in self.resources

    def _get_resources(self, intent: str) -> str:
        """Get relevant resources with formatting"""
        if intent not in self.resources:
            return ""
            
        resources = random.sample(self.resources[intent], min(2, len(self.resources[intent])))
        return "\n\nHelpful resources:\n• " + "\n• ".join(resources)

    def _analyze_sentiment(self, message: str) -> float:
        """Analyze message sentiment with enhanced word lists"""
        positive = ["hope", "better", "improving", "progress", "happy", "relief"]
        negative = ["hopeless", "worthless", "terrible", "awful", "hate", "despair"]
        
        words = re.findall(r'\w+', message.lower())
        pos = sum(1 for w in words if w in positive)
        neg = sum(1 for w in words if w in negative)
        total = pos + neg
        
        return (pos - neg) / total if total else 0

    def _extract_user_info(self, message: str):
        """Extract and store user information from messages"""
        if not self.conversation_context["user_info"]["name"]:
            name_match = re.search(r"(?:my name is|i'm called|i am|i'm)\s+([A-Za-z]+)", message, re.I)
            if name_match:
                self.conversation_context["user_info"]["name"] = name_match.group(1)
                
        if re.search(r"(?:see|seeing|talk to)\s+(?:a|my)\s+(?:therapist|counselor)", message, re.I):
            self.conversation_context["user_info"]["therapy_history"] = True
            
        if re.search(r"(?:taking|on)\s+(?:medication|prozac|zoloft|lexapro)", message, re.I):
            self.conversation_context["user_info"]["medication"] = True

    def get_conversation_summary(self) -> Dict:
        """Get summary of conversation with insights"""
        return {
            "duration_minutes": (datetime.now() - self.conversation_context["start_time"]).seconds // 60,
            "main_topics": self._get_main_topics(),
            "sentiment_trend": self._get_sentiment_trend(),
            "user_info": self.conversation_context["user_info"],
            "crisis_flagged": any(m for m in self.conversation_context["message_history"] 
                                 if self._assess_crisis_risk(m))
        }

    def _get_main_topics(self) -> List[str]:
        """Extract main topics from conversation history"""
        if self.conversation_context["current_topic"]:
            return [self.conversation_context["current_topic"]]
        return []

    def _get_sentiment_trend(self) -> str:
        """Get sentiment trend with enhanced analysis"""
        if not self.conversation_context["sentiment_trend"]:
            return "neutral"
            
        avg = sum(self.conversation_context["sentiment_trend"]) / len(self.conversation_context["sentiment_trend"])
        if avg > 0.3:
            return "positive"
        elif avg < -0.3:
            return "negative"
        return "mixed"

    def generate(self, message: str, intent: Optional[str] = None) -> str:
        """Alias for generate_response that matches the expected interface"""
        return self.generate_response(message, intent)
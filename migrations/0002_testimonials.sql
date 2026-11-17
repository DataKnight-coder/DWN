-- Approved DWN source excerpts. The original PDF remains the source of record.
-- Page 29 repeats page 4 and is intentionally not seeded twice.
CREATE TABLE IF NOT EXISTS testimonial_experiment_events (
  id TEXT PRIMARY KEY, session_id TEXT NOT NULL, variant TEXT NOT NULL CHECK (variant IN ('control','quote')),
  placement TEXT NOT NULL CHECK (placement IN ('webinar','membership')),
  action TEXT NOT NULL CHECK (action IN ('impression','click')),
  testimonial_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, placement, action)
);
CREATE INDEX IF NOT EXISTS idx_testimonial_experiment ON testimonial_experiment_events(placement,variant,action,created_at);
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-03','Now, seeing my first commission come in is such an encouraging moment for me.','Ufuoma Ophikor','Affiliate marketing','source/page-03.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-04','Absolutely grateful indeed!','Sharon Ileoba','AI and remote work','source/page-04.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-05','The Community is fantastic to say the least. Keep it up 👍','DWN member','Community support','source/page-05.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-07','Woke up this morning to see my first affiliate marketing payment.. now I’m adding affiliate marketing to my money making stream..','Funmilayo Sotomide','Affiliate marketing','source/page-07.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-08','After joining this community (Diaspora Wealth Network) and watching the modules on AI training and monetization, I landed a gig where I’m now earning US$90 per hour!','Ifeanyi Offodile','AI and remote work','source/page-08.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-09','Today, I’m excited to share that I’ve hit 200K subscribers on YouTube in less than a month!🥳🎉','Elizabeth Aiyejunikanwa','Digital business','source/page-09.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-10','My affiliate commission just rolled in','Hope Obewho','Affiliate marketing','source/page-10.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-11','FROM ZERO TO 4+ STREAMS OF INCOME IN 30 DAYS! 🚀','Rita ririluxe Egbe','Digital business','source/page-11.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-12','Thank you to our coaches','Olaitan R','Career development','source/page-12.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-13','This gave me so much confidence to start and within just one month I have welcomed my first guest, then my second and now hosting my third guest.','Elizabeth Akintokun','Airbnb and real estate','source/page-13.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-14','And guess what? I made my very first digital sale within 24 hours of setting everything up! 🎉','DWN member','Digital business','source/page-14.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-15','I have 3 bookings waiting, fist one for 2 night. Checked in last night.','Hope Obewho','Airbnb and real estate','source/page-15.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-16','Just completed the living rent free module. Enjoyed every bit of it and how it really worked out for you.','Hope Obewho','Community support','source/page-16.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-18','I’m so grateful to be a member of this amazing community that has empowered me to learn and earn at the same time.','DWN member','Community support','source/page-18.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-19','Thanks for your life programme today and for the opportunity to join this wonderful group and business.','Olu','Community support','source/page-19.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-21','One thing about being in this community is that you get updated on extra ways to make money.','Chidinma Aniakor','AI and remote work','source/page-21.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-24','Seeing that first commission come through was such a powerful reminder that taking action matters.','Edryne Michel','Affiliate marketing','source/page-24.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-25','I’m so excited and grateful to wake up to my affiliate commission alert this morning!','Elizabeth Aiyejunikanwa','Affiliate marketing','source/page-25.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-27','Wow.. since I joined DWN, it’s been new knowledge on a daily basis.','Funmilayo Sarah Sotomide','Digital business','source/page-27.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-31','I am so grateful to Dr Hauwa for putting together such a powerful educational system that gives people options on several ways they can be generating income.','Oluwaseun Odetola','AI and remote work','source/page-31.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
INSERT INTO testimonials(id,quote,attribution,category,evidence_key,consent_reference,status,approved_by,approved_at)
VALUES('dwn-pdf-34','Just Got my first sale on my ebay store, work up to the email sale this morning','DWN member','Digital business','source/page-34.jpg','owner-confirmed-2026-11-17','approved','project-owner',CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;

--
-- PostgreSQL database dump
--

\restrict Ke8rf7DSPLsfiQPtEzaBheLaGKk9BCblW7XFekq2DlC5AR69d24OtWcPVdXMAeJ

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    course_name character varying(100) NOT NULL,
    course_code character varying(20) NOT NULL,
    lecturer_name character varying(100) NOT NULL,
    class_name character varying(50) NOT NULL,
    date_of_lecture date,
    scheduled_time time without time zone,
    venue character varying(100),
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: lecturer_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lecturer_reports (
    id integer NOT NULL,
    faculty_name character varying(100) NOT NULL,
    class_name character varying(50) NOT NULL,
    week_of_reporting character varying(20) NOT NULL,
    date_of_lecture date NOT NULL,
    course_name character varying(100) NOT NULL,
    course_code character varying(20) NOT NULL,
    lecturer_name character varying(100) NOT NULL,
    actual_students_present integer NOT NULL,
    total_registered_students integer NOT NULL,
    venue character varying(100) NOT NULL,
    scheduled_time time without time zone NOT NULL,
    topic_taught text NOT NULL,
    learning_outcomes text NOT NULL,
    recommendations text,
    submitted_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lecturer_reports OWNER TO postgres;

--
-- Name: lecturer_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lecturer_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lecturer_reports_id_seq OWNER TO postgres;

--
-- Name: lecturer_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lecturer_reports_id_seq OWNED BY public.lecturer_reports.id;


--
-- Name: program_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.program_reports (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    report_date date NOT NULL,
    submitted_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.program_reports OWNER TO postgres;

--
-- Name: program_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.program_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.program_reports_id_seq OWNER TO postgres;

--
-- Name: program_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.program_reports_id_seq OWNED BY public.program_reports.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    day_of_week character varying(20) NOT NULL,
    course_name character varying(100) NOT NULL,
    rating integer,
    rated_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ratings_id_seq OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: timetable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.timetable (
    id integer NOT NULL,
    day character varying(20) NOT NULL,
    course character varying(100) NOT NULL,
    time_slot character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.timetable OWNER TO postgres;

--
-- Name: timetable_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.timetable_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.timetable_id_seq OWNER TO postgres;

--
-- Name: timetable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.timetable_id_seq OWNED BY public.timetable.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    full_name character varying(100),
    phone_number character varying(20),
    department character varying(100),
    is_logged_in boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['Student'::character varying, 'Lecturer'::character varying, 'PrincipalLecture'::character varying, 'ProgramLeader'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: lecturer_reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecturer_reports ALTER COLUMN id SET DEFAULT nextval('public.lecturer_reports_id_seq'::regclass);


--
-- Name: program_reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.program_reports ALTER COLUMN id SET DEFAULT nextval('public.program_reports_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: timetable id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timetable ALTER COLUMN id SET DEFAULT nextval('public.timetable_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, course_name, course_code, lecturer_name, class_name, date_of_lecture, scheduled_time, venue, created_by, created_at) FROM stdin;
1	Web Application Development	DIWA2110	Dr. Smith	BIT Year 2	2024-10-01	08:30:00	Lab 301	6	2025-10-03 21:19:09.783308
2	Java OOP Programming	DIJA2120	Prof. Johnson	BIT Year 2	2024-10-02	08:30:00	Room 205	6	2025-10-03 21:19:09.783308
3	Database Systems	DIDS2130	Dr. Brown	BIT Year 2	2024-10-01	10:30:00	Lab 302	6	2025-10-03 21:19:09.783308
\.


--
-- Data for Name: lecturer_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lecturer_reports (id, faculty_name, class_name, week_of_reporting, date_of_lecture, course_name, course_code, lecturer_name, actual_students_present, total_registered_students, venue, scheduled_time, topic_taught, learning_outcomes, recommendations, submitted_by, created_at) FROM stdin;
1	Faculty of ICT	BIT Year 2	Week 6	2024-10-01	Web Application Development	DIWA2110	Dr. Smith	28	30	Lab 301	08:30:00	React Components and State Management	Students should be able to create functional components, manage state using useState hook, and handle events in React applications.	More practical examples needed for state management. Consider adding a mini-project for next class.	4	2025-10-03 21:19:09.783308
\.


--
-- Data for Name: program_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.program_reports (id, title, content, report_date, submitted_by, created_at) FROM stdin;
1	Q3 Program Review - BIT Department	The Bachelor of Information Technology program shows strong performance with 85% student attendance rate and positive feedback on the updated curriculum.	2024-10-01	6	2025-10-03 21:19:09.783308
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ratings (id, day_of_week, course_name, rating, rated_by, created_at) FROM stdin;
1	Monday	Web Application Development	5	1	2025-10-03 21:19:09.783308
2	Tuesday	Java OOP Programming	4	1	2025-10-03 21:19:09.783308
3	Wednesday	Financial Accounting	3	2	2025-10-03 21:19:09.783308
4	Monday	Web Application	4	7	2025-10-03 21:21:21.757839
5	Tuesday	Java OOP	2	7	2025-10-03 21:21:21.763907
6	Friday	Concept of Organisation	1	7	2025-10-03 21:21:21.768814
\.


--
-- Data for Name: timetable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.timetable (id, day, course, time_slot, created_at) FROM stdin;
1	Monday	Web Application Development	08:30 - 10:30	2025-10-03 21:19:09.783308
2	Monday	Database Systems	10:30 - 12:30	2025-10-03 21:19:09.783308
3	Tuesday	Java OOP Programming	08:30 - 10:30	2025-10-03 21:19:09.783308
4	Tuesday	Network Fundamentals	10:30 - 12:30	2025-10-03 21:19:09.783308
5	Wednesday	Financial Accounting	08:30 - 10:30	2025-10-03 21:19:09.783308
6	Wednesday	Business Statistics	10:30 - 12:30	2025-10-03 21:19:09.783308
7	Thursday	Data Communication	08:30 - 10:30	2025-10-03 21:19:09.783308
8	Thursday	System Analysis & Design	10:30 - 12:30	2025-10-03 21:19:09.783308
9	Friday	Concept of Organisation	08:30 - 10:30	2025-10-03 21:19:09.783308
10	Friday	Digital Marketing	10:30 - 12:30	2025-10-03 21:19:09.783308
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, role, full_name, phone_number, department, is_logged_in, created_at) FROM stdin;
1	student1	student1@luct.ac.ls	123	Student	John Student	266-1234	Faculty of ICT	f	2025-10-03 21:19:09.783308
2	student2	student2@luct.ac.ls	123	Student	Mary Student	266-1235	Faculty of ICT	f	2025-10-03 21:19:09.783308
3	lecturer1	lecturer1@luct.ac.ls	123	Lecturer	Dr. Smith Lecturer	266-1236	Faculty of ICT	f	2025-10-03 21:19:09.783308
4	lecturer2	lecturer2@luct.ac.ls	123	Lecturer	Prof. Johnson	266-1237	Faculty of ICT	f	2025-10-03 21:19:09.783308
5	principal1	principal1@luct.ac.ls	123	PrincipalLecture	Mr. Principal	266-1238	Faculty of ICT	f	2025-10-03 21:19:09.783308
6	leader1	leader1@luct.ac.ls	123	ProgramLeader	Ms. Program Leader	266-1239	Faculty of ICT	f	2025-10-03 21:19:09.783308
7	makhabane@gmail.com	makhabane@gmail.com	12345	Student	Koko Matata	57777888	FICT	t	2025-10-03 21:20:45.078349
8	tau@gmail.com	tau@gmail.com	123	Lecturer	Tua	57575757	FICT	t	2025-10-03 21:23:11.008578
\.


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 3, true);


--
-- Name: lecturer_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lecturer_reports_id_seq', 1, true);


--
-- Name: program_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.program_reports_id_seq', 1, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ratings_id_seq', 6, true);


--
-- Name: timetable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.timetable_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: courses courses_course_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_course_code_key UNIQUE (course_code);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: lecturer_reports lecturer_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecturer_reports
    ADD CONSTRAINT lecturer_reports_pkey PRIMARY KEY (id);


--
-- Name: program_reports program_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.program_reports
    ADD CONSTRAINT program_reports_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: timetable timetable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timetable
    ADD CONSTRAINT timetable_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_courses_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_courses_code ON public.courses USING btree (course_code);


--
-- Name: idx_courses_lecturer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_courses_lecturer ON public.courses USING btree (lecturer_name);


--
-- Name: idx_lecturer_reports_course; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lecturer_reports_course ON public.lecturer_reports USING btree (course_name);


--
-- Name: idx_lecturer_reports_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lecturer_reports_date ON public.lecturer_reports USING btree (date_of_lecture);


--
-- Name: idx_lecturer_reports_lecturer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lecturer_reports_lecturer ON public.lecturer_reports USING btree (lecturer_name);


--
-- Name: idx_program_reports_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_program_reports_date ON public.program_reports USING btree (report_date);


--
-- Name: idx_ratings_course; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ratings_course ON public.ratings USING btree (course_name);


--
-- Name: idx_ratings_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ratings_user ON public.ratings USING btree (rated_by);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: courses courses_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: lecturer_reports lecturer_reports_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecturer_reports
    ADD CONSTRAINT lecturer_reports_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.users(id);


--
-- Name: program_reports program_reports_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.program_reports
    ADD CONSTRAINT program_reports_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.users(id);


--
-- Name: ratings ratings_rated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_rated_by_fkey FOREIGN KEY (rated_by) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Ke8rf7DSPLsfiQPtEzaBheLaGKk9BCblW7XFekq2DlC5AR69d24OtWcPVdXMAeJ


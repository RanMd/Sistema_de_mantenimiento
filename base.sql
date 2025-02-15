PGDMP                       }            GestionActivos    17.2    17.2 j    V           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            W           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            X           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            Y           1262    16395    GestionActivos    DATABASE     �   CREATE DATABASE "GestionActivos" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Ecuador.1252';
     DROP DATABASE "GestionActivos";
                     postgres    false            �           1247    16535    categoria_activo    TYPE     R   CREATE TYPE public.categoria_activo AS ENUM (
    'Informatica',
    'Oficina'
);
 #   DROP TYPE public.categoria_activo;
       public               postgres    false            h           1247    16397    estado_activo    TYPE     Z   CREATE TYPE public.estado_activo AS ENUM (
    'Nuevo',
    'Averiado',
    'Reparado'
);
     DROP TYPE public.estado_activo;
       public               postgres    false            k           1247    16402    estado_componente    TYPE     ^   CREATE TYPE public.estado_componente AS ENUM (
    'Nuevo',
    'Reparado',
    'Cambiado'
);
 $   DROP TYPE public.estado_componente;
       public               postgres    false            n           1247    16410    fabricante_activo    TYPE     m   CREATE TYPE public.fabricante_activo AS ENUM (
    'HP',
    'Dell',
    'Lenovo',
    'Asus',
    'Acer'
);
 $   DROP TYPE public.fabricante_activo;
       public               postgres    false            q           1247    16422    tipo_activo    TYPE     p   CREATE TYPE public.tipo_activo AS ENUM (
    'Monitor',
    'PC',
    'Teclado',
    'Impresora',
    'Mesa'
);
    DROP TYPE public.tipo_activo;
       public               postgres    false            �            1255    16714    close_maintenance()    FUNCTION       CREATE FUNCTION public.close_maintenance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
    IF NEW.state_mant = 0 THEN
		UPDATE activos
	    SET in_maintenance = false
	    WHERE id_act IN (
	        SELECT id_act
	        FROM detalle_mantenimiento
	        WHERE num_mant_per = OLD.num_mant
	    );
	ELSIF NEW.state_mant = 1 THEN
		UPDATE activos
		SET in_maintenance = true
		WHERE id_act IN (
			SELECT id_act
			FROM detalle_mantenimiento
			WHERE num_mant_per = OLD.num_mant
		);
	END IF;
    RETURN NEW;
END;$$;
 *   DROP FUNCTION public.close_maintenance();
       public               postgres    false            �            1255    16431    set_components()    FUNCTION     �  CREATE FUNCTION public.set_components() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE
	components TEXT[];
	comp TEXT;
BEGIN
	SELECT ARRAY(
        SELECT name_comp
        FROM componentes_activo
        WHERE type_act_comp = NEW.type_act
    )
    INTO components;

	IF array_length(components, 1) != 0 THEN
		FOREACH comp IN ARRAY components
		LOOP
			INSERT INTO detalle_componentes_activo(name_comp, id_act_per)
			VALUES(comp, NEW.id_act);
		END LOOP;
	END IF;

	RETURN NEW;
END;
$$;
 '   DROP FUNCTION public.set_components();
       public               postgres    false            �            1255    16708    update_in_deleting_mant_act()    FUNCTION     �   CREATE FUNCTION public.update_in_deleting_mant_act() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE
BEGIN
	UPDATE activos
		SET in_maintenance = false
		WHERE id_act = OLD.id_act;
	RETURN OLD;
END;$$;
 4   DROP FUNCTION public.update_in_deleting_mant_act();
       public               postgres    false            �            1255    16706    update_in_insert_mant_act()    FUNCTION     �   CREATE FUNCTION public.update_in_insert_mant_act() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE
BEGIN
	UPDATE activos
		SET in_maintenance = true
		WHERE id_act = NEW.id_act;
	RETURN NEW;
END;$$;
 2   DROP FUNCTION public.update_in_insert_mant_act();
       public               postgres    false            �            1255    16704    update_state_act()    FUNCTION     �   CREATE FUNCTION public.update_state_act() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE
BEGIN
	IF NEW.state_act != 'Nuevo' THEN
		UPDATE activos
		SET state_act = NEW.state_act
		WHERE id_act = NEW.id_act;
	END IF;

	RETURN NEW;
END;$$;
 )   DROP FUNCTION public.update_state_act();
       public               postgres    false            �            1259    16432    activos    TABLE     �  CREATE TABLE public.activos (
    id_act integer NOT NULL,
    name_act character varying(30),
    code_act character varying(20) NOT NULL,
    ubication_act integer,
    brand_act character varying(20),
    type_act character varying(30) NOT NULL,
    buy_process_act integer DEFAULT 1 NOT NULL,
    in_maintenance boolean DEFAULT false,
    state_act character varying(50) DEFAULT 'Nuevo'::character varying
);
    DROP TABLE public.activos;
       public         heap r       postgres    false            �            1259    16436    activos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.activos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.activos_id_seq;
       public               postgres    false    217            Z           0    0    activos_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.activos_id_seq OWNED BY public.activos.id_act;
          public               postgres    false    218            �            1259    16437    componentes_activo    TABLE     �   CREATE TABLE public.componentes_activo (
    name_comp character varying(50) NOT NULL,
    type_act_comp character varying(30)
);
 &   DROP TABLE public.componentes_activo;
       public         heap r       postgres    false            �            1259    16624    detalle_componentes_activo    TABLE     �   CREATE TABLE public.detalle_componentes_activo (
    name_comp character varying(100) NOT NULL,
    id_act_per integer,
    state_component public.estado_componente DEFAULT 'Nuevo'::public.estado_componente NOT NULL
);
 .   DROP TABLE public.detalle_componentes_activo;
       public         heap r       postgres    false    875    875            �            1259    16601    detalle_mantenimiento    TABLE     �   CREATE TABLE public.detalle_mantenimiento (
    num_mant_per integer NOT NULL,
    id_act integer NOT NULL,
    state_act character varying(50),
    id_detail smallint NOT NULL
);
 )   DROP TABLE public.detalle_mantenimiento;
       public         heap r       postgres    false            �            1259    16684 !   detalle_mantenimiento_actividades    TABLE     �   CREATE TABLE public.detalle_mantenimiento_actividades (
    id_detail_per smallint,
    activity_act character varying NOT NULL
);
 5   DROP TABLE public.detalle_mantenimiento_actividades;
       public         heap r       postgres    false            �            1259    16635     detalle_mantenimiento_componente    TABLE     �   CREATE TABLE public.detalle_mantenimiento_componente (
    id_detail_per smallint,
    name_comp_mant character varying,
    type_mant character varying
);
 4   DROP TABLE public.detalle_mantenimiento_componente;
       public         heap r       postgres    false            �            1259    16440 	   edificios    TABLE     \   CREATE TABLE public.edificios (
    id_edi smallint NOT NULL,
    name_edi text NOT NULL
);
    DROP TABLE public.edificios;
       public         heap r       postgres    false            �            1259    16445    edificios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.edificios_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.edificios_id_seq;
       public               postgres    false    220            [           0    0    edificios_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.edificios_id_seq OWNED BY public.edificios.id_edi;
          public               postgres    false    221            �            1259    16562    fabricantes    TABLE     �   CREATE TABLE public.fabricantes (
    name_fab character varying(30) NOT NULL,
    category_fab public.categoria_activo NOT NULL
);
    DROP TABLE public.fabricantes;
       public         heap r       postgres    false    902            �            1259    16674    id_detail_seq    SEQUENCE     �   CREATE SEQUENCE public.id_detail_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.id_detail_seq;
       public               postgres    false    234            \           0    0    id_detail_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.id_detail_seq OWNED BY public.detalle_mantenimiento.id_detail;
          public               postgres    false    237            �            1259    16587    mantenimientos    TABLE     4  CREATE TABLE public.mantenimientos (
    num_mant integer NOT NULL,
    attendant_mant character varying,
    date_start_mant date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_end_mant date,
    code_mant character varying(30),
    state_mant smallint DEFAULT 1,
    type_attendant_mant character varying
);
 "   DROP TABLE public.mantenimientos;
       public         heap r       postgres    false            �            1259    16586    num_mant_seq    SEQUENCE     �   CREATE SEQUENCE public.num_mant_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.num_mant_seq;
       public               postgres    false    233            ]           0    0    num_mant_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.num_mant_seq OWNED BY public.mantenimientos.num_mant;
          public               postgres    false    232            �            1259    16446    procesos_compra    TABLE     �   CREATE TABLE public.procesos_compra (
    id_proc smallint NOT NULL,
    code_proc character varying(10) NOT NULL,
    date_proc date DEFAULT CURRENT_DATE NOT NULL,
    provider_proc integer NOT NULL
);
 #   DROP TABLE public.procesos_compra;
       public         heap r       postgres    false            �            1259    16450    procesos_compra_id_proc_seq    SEQUENCE     �   CREATE SEQUENCE public.procesos_compra_id_proc_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.procesos_compra_id_proc_seq;
       public               postgres    false    222            ^           0    0    procesos_compra_id_proc_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.procesos_compra_id_proc_seq OWNED BY public.procesos_compra.id_proc;
          public               postgres    false    223            �            1259    16451    proveedores    TABLE     �   CREATE TABLE public.proveedores (
    id_pro integer NOT NULL,
    name_pro character varying(50) NOT NULL,
    address_pro character varying(20)
);
    DROP TABLE public.proveedores;
       public         heap r       postgres    false            �            1259    16454    proveedores_id_seq    SEQUENCE     �   CREATE SEQUENCE public.proveedores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.proveedores_id_seq;
       public               postgres    false    224            _           0    0    proveedores_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.proveedores_id_seq OWNED BY public.proveedores.id_pro;
          public               postgres    false    225            �            1259    16542    tipos_activo    TABLE     �   CREATE TABLE public.tipos_activo (
    name_type character varying(30) NOT NULL,
    category_type public.categoria_activo NOT NULL
);
     DROP TABLE public.tipos_activo;
       public         heap r       postgres    false    902            �            1259    16459    ubicaciones    TABLE     �   CREATE TABLE public.ubicaciones (
    id_ubi integer NOT NULL,
    floor_ubi smallint NOT NULL,
    name_ubi text NOT NULL,
    id_edi_per smallint
);
    DROP TABLE public.ubicaciones;
       public         heap r       postgres    false            �            1259    16464    ubicaciones_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ubicaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.ubicaciones_id_seq;
       public               postgres    false    226            `           0    0    ubicaciones_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.ubicaciones_id_seq OWNED BY public.ubicaciones.id_ubi;
          public               postgres    false    227            �            1259    16465    usuarios    TABLE     �   CREATE TABLE public.usuarios (
    id_user smallint NOT NULL,
    name_user character varying(20) NOT NULL,
    pass_user character varying(20) NOT NULL,
    rol_user character(1) NOT NULL
);
    DROP TABLE public.usuarios;
       public         heap r       postgres    false            �            1259    16468    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    228            a           0    0    users_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.users_id_seq OWNED BY public.usuarios.id_user;
          public               postgres    false    229            p           2604    16469    activos id_act    DEFAULT     l   ALTER TABLE ONLY public.activos ALTER COLUMN id_act SET DEFAULT nextval('public.activos_id_seq'::regclass);
 =   ALTER TABLE public.activos ALTER COLUMN id_act DROP DEFAULT;
       public               postgres    false    218    217            }           2604    16675    detalle_mantenimiento id_detail    DEFAULT     |   ALTER TABLE ONLY public.detalle_mantenimiento ALTER COLUMN id_detail SET DEFAULT nextval('public.id_detail_seq'::regclass);
 N   ALTER TABLE public.detalle_mantenimiento ALTER COLUMN id_detail DROP DEFAULT;
       public               postgres    false    237    234            t           2604    16470    edificios id_edi    DEFAULT     p   ALTER TABLE ONLY public.edificios ALTER COLUMN id_edi SET DEFAULT nextval('public.edificios_id_seq'::regclass);
 ?   ALTER TABLE public.edificios ALTER COLUMN id_edi DROP DEFAULT;
       public               postgres    false    221    220            z           2604    16590    mantenimientos num_mant    DEFAULT     s   ALTER TABLE ONLY public.mantenimientos ALTER COLUMN num_mant SET DEFAULT nextval('public.num_mant_seq'::regclass);
 F   ALTER TABLE public.mantenimientos ALTER COLUMN num_mant DROP DEFAULT;
       public               postgres    false    232    233    233            u           2604    16471    procesos_compra id_proc    DEFAULT     �   ALTER TABLE ONLY public.procesos_compra ALTER COLUMN id_proc SET DEFAULT nextval('public.procesos_compra_id_proc_seq'::regclass);
 F   ALTER TABLE public.procesos_compra ALTER COLUMN id_proc DROP DEFAULT;
       public               postgres    false    223    222            w           2604    16472    proveedores id_pro    DEFAULT     t   ALTER TABLE ONLY public.proveedores ALTER COLUMN id_pro SET DEFAULT nextval('public.proveedores_id_seq'::regclass);
 A   ALTER TABLE public.proveedores ALTER COLUMN id_pro DROP DEFAULT;
       public               postgres    false    225    224            x           2604    16474    ubicaciones id_ubi    DEFAULT     t   ALTER TABLE ONLY public.ubicaciones ALTER COLUMN id_ubi SET DEFAULT nextval('public.ubicaciones_id_seq'::regclass);
 A   ALTER TABLE public.ubicaciones ALTER COLUMN id_ubi DROP DEFAULT;
       public               postgres    false    227    226            y           2604    16475    usuarios id_user    DEFAULT     l   ALTER TABLE ONLY public.usuarios ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_seq'::regclass);
 ?   ALTER TABLE public.usuarios ALTER COLUMN id_user DROP DEFAULT;
       public               postgres    false    229    228            >          0    16432    activos 
   TABLE DATA           �   COPY public.activos (id_act, name_act, code_act, ubication_act, brand_act, type_act, buy_process_act, in_maintenance, state_act) FROM stdin;
    public               postgres    false    217   X�       @          0    16437    componentes_activo 
   TABLE DATA           F   COPY public.componentes_activo (name_comp, type_act_comp) FROM stdin;
    public               postgres    false    219   ��       P          0    16624    detalle_componentes_activo 
   TABLE DATA           \   COPY public.detalle_componentes_activo (name_comp, id_act_per, state_component) FROM stdin;
    public               postgres    false    235   '�       O          0    16601    detalle_mantenimiento 
   TABLE DATA           [   COPY public.detalle_mantenimiento (num_mant_per, id_act, state_act, id_detail) FROM stdin;
    public               postgres    false    234   ��       S          0    16684 !   detalle_mantenimiento_actividades 
   TABLE DATA           X   COPY public.detalle_mantenimiento_actividades (id_detail_per, activity_act) FROM stdin;
    public               postgres    false    238   D�       Q          0    16635     detalle_mantenimiento_componente 
   TABLE DATA           d   COPY public.detalle_mantenimiento_componente (id_detail_per, name_comp_mant, type_mant) FROM stdin;
    public               postgres    false    236   ��       A          0    16440 	   edificios 
   TABLE DATA           5   COPY public.edificios (id_edi, name_edi) FROM stdin;
    public               postgres    false    220   �       L          0    16562    fabricantes 
   TABLE DATA           =   COPY public.fabricantes (name_fab, category_fab) FROM stdin;
    public               postgres    false    231   �       N          0    16587    mantenimientos 
   TABLE DATA           �   COPY public.mantenimientos (num_mant, attendant_mant, date_start_mant, date_end_mant, code_mant, state_mant, type_attendant_mant) FROM stdin;
    public               postgres    false    233   ��       C          0    16446    procesos_compra 
   TABLE DATA           W   COPY public.procesos_compra (id_proc, code_proc, date_proc, provider_proc) FROM stdin;
    public               postgres    false    222   Z�       E          0    16451    proveedores 
   TABLE DATA           D   COPY public.proveedores (id_pro, name_pro, address_pro) FROM stdin;
    public               postgres    false    224   ��       K          0    16542    tipos_activo 
   TABLE DATA           @   COPY public.tipos_activo (name_type, category_type) FROM stdin;
    public               postgres    false    230   8�       G          0    16459    ubicaciones 
   TABLE DATA           N   COPY public.ubicaciones (id_ubi, floor_ubi, name_ubi, id_edi_per) FROM stdin;
    public               postgres    false    226   ��       I          0    16465    usuarios 
   TABLE DATA           K   COPY public.usuarios (id_user, name_user, pass_user, rol_user) FROM stdin;
    public               postgres    false    228   %�       b           0    0    activos_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.activos_id_seq', 50, true);
          public               postgres    false    218            c           0    0    edificios_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.edificios_id_seq', 4, true);
          public               postgres    false    221            d           0    0    id_detail_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.id_detail_seq', 28, true);
          public               postgres    false    237            e           0    0    num_mant_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.num_mant_seq', 17, true);
          public               postgres    false    232            f           0    0    procesos_compra_id_proc_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.procesos_compra_id_proc_seq', 9, true);
          public               postgres    false    223            g           0    0    proveedores_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.proveedores_id_seq', 3, true);
          public               postgres    false    225            h           0    0    ubicaciones_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.ubicaciones_id_seq', 13, true);
          public               postgres    false    227            i           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 2, true);
          public               postgres    false    229            �           2606    16477    usuarios USUARIOS_NOM_USU_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "USUARIOS_NOM_USU_key" UNIQUE (name_user);
 I   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT "USUARIOS_NOM_USU_key";
       public                 postgres    false    228            �           2606    16479    usuarios USUARIOS_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "USUARIOS_pkey" PRIMARY KEY (id_user);
 B   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT "USUARIOS_pkey";
       public                 postgres    false    228            �           2606    16481    activos activos_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.activos
    ADD CONSTRAINT activos_pkey PRIMARY KEY (id_act);
 >   ALTER TABLE ONLY public.activos DROP CONSTRAINT activos_pkey;
       public                 postgres    false    217            �           2606    16681 0   detalle_mantenimiento detalle_mantenimiento_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.detalle_mantenimiento
    ADD CONSTRAINT detalle_mantenimiento_pkey PRIMARY KEY (id_detail);
 Z   ALTER TABLE ONLY public.detalle_mantenimiento DROP CONSTRAINT detalle_mantenimiento_pkey;
       public                 postgres    false    234            �           2606    16483    edificios edificios_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.edificios
    ADD CONSTRAINT edificios_pkey PRIMARY KEY (id_edi);
 B   ALTER TABLE ONLY public.edificios DROP CONSTRAINT edificios_pkey;
       public                 postgres    false    220            �           2606    16566    fabricantes fabricantes_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.fabricantes
    ADD CONSTRAINT fabricantes_pkey PRIMARY KEY (name_fab);
 F   ALTER TABLE ONLY public.fabricantes DROP CONSTRAINT fabricantes_pkey;
       public                 postgres    false    231            �           2606    16595 "   mantenimientos mantenimientos_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.mantenimientos
    ADD CONSTRAINT mantenimientos_pkey PRIMARY KEY (num_mant);
 L   ALTER TABLE ONLY public.mantenimientos DROP CONSTRAINT mantenimientos_pkey;
       public                 postgres    false    233            �           2606    16554    tipos_activo name_unique 
   CONSTRAINT     X   ALTER TABLE ONLY public.tipos_activo
    ADD CONSTRAINT name_unique UNIQUE (name_type);
 B   ALTER TABLE ONLY public.tipos_activo DROP CONSTRAINT name_unique;
       public                 postgres    false    230            �           2606    16659 (   componentes_activo name_unique_component 
   CONSTRAINT     h   ALTER TABLE ONLY public.componentes_activo
    ADD CONSTRAINT name_unique_component UNIQUE (name_comp);
 R   ALTER TABLE ONLY public.componentes_activo DROP CONSTRAINT name_unique_component;
       public                 postgres    false    219            �           2606    16485 $   procesos_compra procesos_compra_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.procesos_compra
    ADD CONSTRAINT procesos_compra_pkey PRIMARY KEY (id_proc);
 N   ALTER TABLE ONLY public.procesos_compra DROP CONSTRAINT procesos_compra_pkey;
       public                 postgres    false    222            �           2606    16487    proveedores proveedores_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.proveedores
    ADD CONSTRAINT proveedores_pkey PRIMARY KEY (id_pro);
 F   ALTER TABLE ONLY public.proveedores DROP CONSTRAINT proveedores_pkey;
       public                 postgres    false    224                       2606    16672    mantenimientos state_mant_check    CHECK CONSTRAINT     z   ALTER TABLE public.mantenimientos
    ADD CONSTRAINT state_mant_check CHECK ((state_mant = ANY (ARRAY[0, 1]))) NOT VALID;
 D   ALTER TABLE public.mantenimientos DROP CONSTRAINT state_mant_check;
       public               postgres    false    233    233            �           2606    16491    ubicaciones ubicaciones_pkey1 
   CONSTRAINT     _   ALTER TABLE ONLY public.ubicaciones
    ADD CONSTRAINT ubicaciones_pkey1 PRIMARY KEY (id_ubi);
 G   ALTER TABLE ONLY public.ubicaciones DROP CONSTRAINT ubicaciones_pkey1;
       public                 postgres    false    226            �           2606    16493    activos unique_code 
   CONSTRAINT     R   ALTER TABLE ONLY public.activos
    ADD CONSTRAINT unique_code UNIQUE (code_act);
 =   ALTER TABLE ONLY public.activos DROP CONSTRAINT unique_code;
       public                 postgres    false    217            �           2606    16495 #   procesos_compra unique_code_process 
   CONSTRAINT     c   ALTER TABLE ONLY public.procesos_compra
    ADD CONSTRAINT unique_code_process UNIQUE (code_proc);
 M   ALTER TABLE ONLY public.procesos_compra DROP CONSTRAINT unique_code_process;
       public                 postgres    false    222            �           2620    16715 (   mantenimientos trigger_close_maintenance    TRIGGER     �   CREATE TRIGGER trigger_close_maintenance AFTER UPDATE OF state_mant ON public.mantenimientos FOR EACH ROW EXECUTE FUNCTION public.close_maintenance();
 A   DROP TRIGGER trigger_close_maintenance ON public.mantenimientos;
       public               postgres    false    233    233    243            �           2620    16709 (   detalle_mantenimiento trigger_delete_act    TRIGGER     �   CREATE TRIGGER trigger_delete_act AFTER DELETE ON public.detalle_mantenimiento FOR EACH ROW EXECUTE FUNCTION public.update_in_deleting_mant_act();
 A   DROP TRIGGER trigger_delete_act ON public.detalle_mantenimiento;
       public               postgres    false    240    234            �           2620    16710 (   detalle_mantenimiento trigger_insert_act    TRIGGER     �   CREATE TRIGGER trigger_insert_act BEFORE INSERT ON public.detalle_mantenimiento FOR EACH ROW EXECUTE FUNCTION public.update_in_insert_mant_act();
 A   DROP TRIGGER trigger_insert_act ON public.detalle_mantenimiento;
       public               postgres    false    241    234            �           2620    16496    activos trigger_set_components    TRIGGER     |   CREATE TRIGGER trigger_set_components AFTER INSERT ON public.activos FOR EACH ROW EXECUTE FUNCTION public.set_components();
 7   DROP TRIGGER trigger_set_components ON public.activos;
       public               postgres    false    239    217            �           2620    16711 '   detalle_mantenimiento trigger_state_act    TRIGGER     �   CREATE TRIGGER trigger_state_act BEFORE INSERT OR UPDATE OF state_act ON public.detalle_mantenimiento FOR EACH ROW EXECUTE FUNCTION public.update_state_act();
 @   DROP TRIGGER trigger_state_act ON public.detalle_mantenimiento;
       public               postgres    false    234    234    242            �           2620    16707 0   detalle_mantenimiento trigger_update_in_mant_act    TRIGGER     �   CREATE TRIGGER trigger_update_in_mant_act AFTER DELETE ON public.detalle_mantenimiento FOR EACH ROW EXECUTE FUNCTION public.update_in_insert_mant_act();
 I   DROP TRIGGER trigger_update_in_mant_act ON public.detalle_mantenimiento;
       public               postgres    false    241    234            �           2606    16567    activos brand_act_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.activos
    ADD CONSTRAINT brand_act_fkey FOREIGN KEY (brand_act) REFERENCES public.fabricantes(name_fab) NOT VALID;
 @   ALTER TABLE ONLY public.activos DROP CONSTRAINT brand_act_fkey;
       public               postgres    false    231    217    4759            �           2606    16576    activos buy_process_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.activos
    ADD CONSTRAINT buy_process_fkey FOREIGN KEY (buy_process_act) REFERENCES public.procesos_compra(id_proc) NOT VALID;
 B   ALTER TABLE ONLY public.activos DROP CONSTRAINT buy_process_fkey;
       public               postgres    false    222    217    4745            �           2606    16630 5   detalle_componentes_activo componente_id_act_per_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_componentes_activo
    ADD CONSTRAINT componente_id_act_per_fkey FOREIGN KEY (id_act_per) REFERENCES public.activos(id_act);
 _   ALTER TABLE ONLY public.detalle_componentes_activo DROP CONSTRAINT componente_id_act_per_fkey;
       public               postgres    false    235    4737    217            �           2606    16613 7   detalle_mantenimiento detalle_mantenimiento_id_act_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_mantenimiento
    ADD CONSTRAINT detalle_mantenimiento_id_act_fkey FOREIGN KEY (id_act) REFERENCES public.activos(id_act);
 a   ALTER TABLE ONLY public.detalle_mantenimiento DROP CONSTRAINT detalle_mantenimiento_id_act_fkey;
       public               postgres    false    234    217    4737            �           2606    16608 9   detalle_mantenimiento detalle_mantenimiento_num_mant_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_mantenimiento
    ADD CONSTRAINT detalle_mantenimiento_num_mant_fkey FOREIGN KEY (num_mant_per) REFERENCES public.mantenimientos(num_mant);
 c   ALTER TABLE ONLY public.detalle_mantenimiento DROP CONSTRAINT detalle_mantenimiento_num_mant_fkey;
       public               postgres    false    233    234    4761            �           2606    16507    ubicaciones fk_edificios    FK CONSTRAINT     �   ALTER TABLE ONLY public.ubicaciones
    ADD CONSTRAINT fk_edificios FOREIGN KEY (id_edi_per) REFERENCES public.edificios(id_edi);
 B   ALTER TABLE ONLY public.ubicaciones DROP CONSTRAINT fk_edificios;
       public               postgres    false    220    4743    226            �           2606    16512 &   procesos_compra fk_proceso_proveedores    FK CONSTRAINT     �   ALTER TABLE ONLY public.procesos_compra
    ADD CONSTRAINT fk_proceso_proveedores FOREIGN KEY (provider_proc) REFERENCES public.proveedores(id_pro);
 P   ALTER TABLE ONLY public.procesos_compra DROP CONSTRAINT fk_proceso_proveedores;
       public               postgres    false    4749    224    222            �           2606    16689 0   detalle_mantenimiento_actividades id_detail_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_mantenimiento_actividades
    ADD CONSTRAINT id_detail_fkey FOREIGN KEY (id_detail_per) REFERENCES public.detalle_mantenimiento(id_detail) NOT VALID;
 Z   ALTER TABLE ONLY public.detalle_mantenimiento_actividades DROP CONSTRAINT id_detail_fkey;
       public               postgres    false    238    234    4763            �           2606    16555    activos type_act_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.activos
    ADD CONSTRAINT type_act_fkey FOREIGN KEY (type_act) REFERENCES public.tipos_activo(name_type) NOT VALID;
 ?   ALTER TABLE ONLY public.activos DROP CONSTRAINT type_act_fkey;
       public               postgres    false    217    4757    230            �           2606    16661     componentes_activo type_act_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.componentes_activo
    ADD CONSTRAINT type_act_fkey FOREIGN KEY (type_act_comp) REFERENCES public.tipos_activo(name_type) NOT VALID;
 J   ALTER TABLE ONLY public.componentes_activo DROP CONSTRAINT type_act_fkey;
       public               postgres    false    4757    230    219            �           2606    16497    activos ubication_act_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.activos
    ADD CONSTRAINT ubication_act_fkey FOREIGN KEY (ubication_act) REFERENCES public.ubicaciones(id_ubi);
 D   ALTER TABLE ONLY public.activos DROP CONSTRAINT ubication_act_fkey;
       public               postgres    false    226    217    4751            >   F  x�u��n�0D��W��L�&p�RҠAM��X�[!�"�﯁�^U�Ų�ϛբ���7]xP�7}6�W�E��C��=��
"衺��<�R]e�~�/�����8�T�J��墺IE|��>����������)��"�&\Np�lc����p�wA}��k+ǈ��U⌳1�9K��#� H�{��"æ����tr
�����1I�I�{Go�ϛl�|\'�d���ø�I�M@W���gC�6t=����t8MO��EVYi��A&ɉC�k9��	1:�`n��oZ-���V��ҹ����&U����r��r���
Ж��K�x�ؐ      @   i   x��̫LM.�/J-���- R�E�\ΉE%���(b�Eɥ�%�
�!ΐ��Ĕ|.�P� g� G_囚�_��b$��p���u���E��͉���� ;�0~      P   �   x�s�41��+M-��
r�Ep|Ss�2�y���%�E�Ŝ�&P1�Ģ���|$!$e&F�B�Eɥ�%�
��@���ƖP�����bC��1�J8? 1/5���Mc1B�qf��3C1�� � �P� �de
      O   v   x�MλA��x������ \��DHH\�lpF��d�v���~� 
���:N�s@%U9QgJK�T�
�d�Ԓ�K�ꤣ�ےj�iB�I�q=����X��֠|�W�����/�S2s      S   Q   x�32��M�+I����L�+�W((J-22��-q�q�d�d�V%*���%�p�b���1���)m����qqq ��G�      Q   6   x�32�tN,*)M��/����-�L�J�22�t�,J.�,�:'�&e�s��qqq o��      A   "   x�3�t�v��2�ts�p�2R��>\1z\\\ S1_      L   d   x�����K�/�M,�LN�rq��A�I��/�Gr,.-FHN-B��vu��O�L��K��H
�)�f�� ��D�KRSs��S"��)H
<����=... ��9�      N   �   x�}��
�0Dϛ�즉i�R<(�x��K� ��J���ۅ4�����F�e�_ Q�)#m���e������vr��p��i��ړ�Ϗ4�H�"8ϝ��K,���"h�2	��a���2c)Q��k��^^Sex(��w��KzlÐ{�R<�QmY�[�����!��V�lc��dR�ad�B|�ה/      C   U   x�=�A�@�3��
���0���;�`�Nڴ��VU��Š���ZM��Ro��a�Ư�ı�����,=>�I��t���� ���      E   i   x�3�(�/KMM�/J-V,�,�W�s��3��8��sS��3s�K+K3s|JR�8�|.cN��⒢̤�L�9�
Υ�yɉ
�z�zAz>z�>W� tR$r      K   F   x�����,�/���K�/�M,�LN�
IM�IL�G��-(J-�/JD�M-N��O�L��K�
pF������ �b �      G   �   x�3�4��IL�/J,�/��Wp	�4�2�4BJMI-��aW00J�ss:��f�e�%&gޜ� _�����3�24@s�!H��q�y@�s8M��Ф��KR�����|��1�KL��1z\\\ �I)      I   /   x�3���v�,H-H542�t�2��tt��LKL��	�r��qqq �	V     
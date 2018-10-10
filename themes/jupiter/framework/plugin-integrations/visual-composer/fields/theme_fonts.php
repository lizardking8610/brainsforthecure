<?php
if (!defined('THEME_FRAMEWORK')) exit('No direct script access allowed');

/**
 * Add font family option to Visual Composer
 *
 * @author      Bob Ulusoy
 * @copyright   Artbees LTD (c)
 * @link        http://artbees.net
 * @since       Version 5.1
 * @package     artbees
 */


if (function_exists('mk_add_shortcode_param')) {
    mk_add_shortcode_param('theme_fonts', 'mk_fonts_settings_field');
}

function mk_fonts_settings_field($settings, $value) {
    $dependency = vc_generate_dependencies_attributes($settings);
    $param_name = isset($settings['param_name']) ? $settings['param_name'] : '';
    $type = isset($settings['type']) ? $settings['type'] : '';
    $uniqeID = uniqid();
    $output = '';
    $output.= '<select name="' . $param_name . '" id="' . $param_name . '" class="mk-shortcode-fonts-list wpb-select wpb_vc_param_value ' . $param_name . ' ' . $type . '">';
    
    $google_webfonts = array(
        'ABeeZee',
        'Abel',
        'Abril+Fatface',
        'Aclonica',
        'Acme',
        'Actor',
        'Adamina',
        'Advent+Pro',
        'Aguafina+Script',
        'Akronim',
        'Aladin',
        'Aldrich',
        'Alef',
        'Alegreya',
        'Alegreya+Sans',
        'Alegreya+Sans+SC',
        'Alegreya+SC',
        'Alex+Brush',
        'Alfa+Slab+One',
        'Alice',
        'Alike',
        'Alike+Angular',
        'Allan',
        'Allerta',
        'Allerta+Stencil',
        'Allura',
        'Almendra',
        'Almendra+Display',
        'Almendra+SC',
        'Amarante',
        'Amaranth',
        'Amatic+SC',
        'Amethysta',
        'Amiri',
        'Amita',
        'Anaheim',
        'Andada',
        'Andika',
        'Angkor',
        'Annie+Use+Your+Telescope',
        'Anonymous+Pro',
        'Antic',
        'Antic+Didone',
        'Antic+Slab',
        'Anton',
        'Arapey',
        'Arbutus',
        'Arbutus+Slab',
        'Architects+Daughter',
        'Archivo+Black',
        'Archivo+Narrow',
        'Arimo',
        'Arizonia',
        'Armata',
        'Artifika',
        'Arvo',
        'Arya',
        'Asap',
        'Asar',
        'Asset',
        'Astloch',
        'Asul',
        'Atomic+Age',
        'Aubrey',
        'Audiowide',
        'Autour+One',
        'Average',
        'Average+Sans',
        'Averia+Gruesa+Libre',
        'Averia+Libre',
        'Averia+Sans+Libre',
        'Averia+Serif+Libre',
        'Bad+Script',
        'Balthazar',
        'Bangers',
        'Basic',
        'Battambang',
        'Baumans',
        'Bayon',
        'Belgrano',
        'Belleza',
        'BenchNine',
        'Bentham',
        'Berkshire+Swash',
        'Bevan',
        'Bigelow+Rules',
        'Bigshot+One',
        'Bilbo',
        'Bilbo+Swash+Caps',
        'Biryani',
        'Bitter',
        'Black+Ops+One',
        'Bokor',
        'Bonbon',
        'Boogaloo',
        'Bowlby+One',
        'Bowlby+One+SC',
        'Brawler',
        'Bree+Serif',
        'Bubblegum+Sans',
        'Bubbler+One',
        'Buda',
        'Buenard',
        'Butcherman',
        'Butterfly+Kids',
        'Cabin',
        'Cabin+Condensed',
        'Cabin+Sketch',
        'Caesar+Dressing',
        'Cagliostro',
        'Calligraffitti',
        'Cambay',
        'Cambo',
        'Candal',
        'Cantarell',
        'Cantata+One',
        'Cantora+One',
        'Capriola',
        'Cardo',
        'Carme',
        'Carrois+Gothic',
        'Carrois+Gothic+SC',
        'Carter+One',
        'Catamaran',
        'Caudex',
        'Cedarville+Cursive',
        'Ceviche+One',
        'Changa+One',
        'Chango',
        'Chau+Philomene+One',
        'Chela+One',
        'Chelsea+Market',
        'Chenla',
        'Cherry+Cream+Soda',
        'Cherry+Swash',
        'Chewy',
        'Chicle',
        'Chivo',
        'Chonburi',
        'Cinzel',
        'Cinzel+Decorative',
        'Clicker+Script',
        'Coda',
        'Coda+Caption',
        'Codystar',
        'Combo',
        'Comfortaa',
        'Coming+Soon',
        'Concert+One',
        'Condiment',
        'Content',
        'Contrail+One',
        'Convergence',
        'Cookie',
        'Copse',
        'Corben',
        'Courgette',
        'Cousine',
        'Coustard',
        'Covered+By+Your+Grace',
        'Crafty+Girls',
        'Creepster',
        'Crete+Round',
        'Crimson+Text',
        'Croissant+One',
        'Crushed',
        'Cuprum',
        'Cutive',
        'Cutive+Mono',
        'Damion',
        'Dancing+Script',
        'Dangrek',
        'Dawning+of+a+New+Day',
        'Days+One',
        'Dekko',
        'Delius',
        'Delius+Swash+Caps',
        'Delius+Unicase',
        'Della+Respira',
        'Denk+One',
        'Devonshire',
        'Dhurjati',
        'Didact+Gothic',
        'Diplomata',
        'Diplomata+SC',
        'Domine',
        'Donegal+One',
        'Doppio+One',
        'Dorsa',
        'Dosis',
        'Dr+Sugiyama',
        'Droid+Sans',
        'Droid+Sans+Mono',
        'Droid+Serif',
        'Duru+Sans',
        'Dynalight',
        'Eagle+Lake',
        'Eater',
        'EB+Garamond',
        'Economica',
        'Eczar',
        'Ek+Mukta',
        'Electrolize',
        'Elsie',
        'Elsie+Swash+Caps',
        'Emblema+One',
        'Emilys+Candy',
        'Engagement',
        'Englebert',
        'Enriqueta',
        'Erica+One',
        'Esteban',
        'Euphoria+Script',
        'Ewert',
        'Exo',
        'Exo+2',
        'Expletus+Sans',
        'Fanwood+Text',
        'Fascinate',
        'Fascinate+Inline',
        'Faster+One',
        'Fasthand',
        'Fauna+One',
        'Federant',
        'Federo',
        'Felipa',
        'Fenix',
        'Finger+Paint',
        'Fira+Mono',
        'Fira+Sans',
        'Fjalla+One',
        'Fjord+One',
        'Flamenco',
        'Flavors',
        'Fondamento',
        'Fontdiner+Swanky',
        'Forum',
        'Francois+One',
        'Freckle+Face',
        'Fredericka+the+Great',
        'Fredoka+One',
        'Freehand',
        'Fresca',
        'Frijole',
        'Fruktur',
        'Fugaz+One',
        'Gabriela',
        'Gafata',
        'Galdeano',
        'Galindo',
        'Gentium+Basic',
        'Gentium+Book+Basic',
        'Geo',
        'Geostar',
        'Geostar+Fill',
        'Germania+One',
        'GFS+Didot',
        'GFS+Neohellenic',
        'Gidugu',
        'Gilda+Display',
        'Give+You+Glory',
        'Glass+Antiqua',
        'Glegoo',
        'Gloria+Hallelujah',
        'Goblin+One',
        'Gochi+Hand',
        'Gorditas',
        'Goudy+Bookletter+1911',
        'Graduate',
        'Grand+Hotel',
        'Gravitas+One',
        'Great+Vibes',
        'Griffy',
        'Gruppo',
        'Gudea',
        'Gurajada',
        'Habibi',
        'Halant',
        'Hammersmith+One',
        'Hanalei',
        'Hanalei+Fill',
        'Handlee',
        'Hanuman',
        'Happy+Monkey',
        'Headland+One',
        'Henny+Penny',
        'Herr+Von+Muellerhoff',
        'Hind',
        'Holtwood+One+SC',
        'Homemade+Apple',
        'Homenaje',
        'Iceberg',
        'Iceland',
        'IM+Fell+Double+Pica',
        'IM+Fell+Double+Pica+SC',
        'IM+Fell+DW+Pica',
        'IM+Fell+DW+Pica+SC',
        'IM+Fell+English',
        'IM+Fell+English+SC',
        'IM+Fell+French+Canon',
        'IM+Fell+French+Canon+SC',
        'IM+Fell+Great+Primer',
        'IM+Fell+Great+Primer+SC',
        'Imprima',
        'Inconsolata',
        'Inder',
        'Indie+Flower',
        'Inika',
        'Inknut+Antiqua',
        'Irish+Grover',
        'Istok+Web',
        'Italiana',
        'Italianno',
        'Itim',
        'Jacques+Francois',
        'Jacques+Francois+Shadow',
        'Jaldi',
        'Jim+Nightshade',
        'Jockey+One',
        'Jolly+Lodger',
        'Josefin+Sans',
        'Josefin+Slab',
        'Joti+One',
        'Judson',
        'Julee',
        'Julius+Sans+One',
        'Junge',
        'Jura',
        'Just+Another+Hand',
        'Just+Me+Again+Down+Here',
        'Kadwa',
        'Kalam',
        'Kameron',
        'Kantumruy',
        'Karla',
        'Karma',
        'Kaushan+Script',
        'Kavoon',
        'Kdam+Thmor',
        'Keania+One',
        'Kelly+Slab',
        'Kenia',
        'Khand',
        'Khmer',
        'Khula',
        'Kite+One',
        'Knewave',
        'Kotta+One',
        'Koulen',
        'Kranky',
        'Kreon',
        'Kristi',
        'Krona+One',
        'Kurale',
        'La+Belle+Aurore',
        'Laila',
        'Lakki+Reddy',
        'Lancelot',
        'Lateef',
        'Lato',
        'League+Script',
        'Leckerli+One',
        'Ledger',
        'Lekton',
        'Lemon',
        'Libre+Baskerville',
        'Life+Savers',
        'Lilita+One',
        'Lily+Script+One',
        'Limelight',
        'Linden+Hill',
        'Lobster',
        'Lobster+Two',
        'Londrina+Outline',
        'Londrina+Shadow',
        'Londrina+Sketch',
        'Londrina+Solid',
        'Lora',
        'Love+Ya+Like+A+Sister',
        'Loved+by+the+King',
        'Lovers+Quarrel',
        'Luckiest+Guy',
        'Lusitana',
        'Lustria',
        'Macondo',
        'Macondo+Swash+Caps',
        'Magra',
        'Maiden+Orange',
        'Mako',
        'Mallanna',
        'Mandali',
        'Marcellus',
        'Marcellus+SC',
        'Marck+Script',
        'Margarine',
        'Marko+One',
        'Marmelad',
        'Martel',
        'Martel+Sans',
        'Marvel',
        'Mate',
        'Mate+SC',
        'Maven+Pro',
        'McLaren',
        'Meddon',
        'MedievalSharp',
        'Medula+One',
        'Megrim',
        'Meie+Script',
        'Merienda',
        'Merienda+One',
        'Merriweather',
        'Merriweather+Sans',
        'Metal',
        'Metal+Mania',
        'Metamorphous',
        'Metrophobic',
        'Michroma',
        'Milonga',
        'Miltonian',
        'Miltonian+Tattoo',
        'Miniver',
        'Miss+Fajardose',
        'Modak',
        'Modern+Antiqua',
        'Molengo',
        'Molle',
        'Monda',
        'Monofett',
        'Monoton',
        'Monsieur+La+Doulaise',
        'Montaga',
        'Montez',
        'Montserrat',
        'Montserrat+Alternates',
        'Montserrat+Subrayada',
        'Moul',
        'Moulpali',
        'Mountains+of+Christmas',
        'Mouse+Memoirs',
        'Mr+Bedfort',
        'Mr+Dafoe',
        'Mr+De+Haviland',
        'Mrs+Saint+Delafield',
        'Mrs+Sheppards',
        'Muli',
        'Mystery+Quest',
        'Neucha',
        'Neuton',
        'New+Rocker',
        'News+Cycle',
        'Niconne',
        'Nixie+One',
        'Nobile',
        'Nokora',
        'Norican',
        'Nosifer',
        'Nothing+You+Could+Do',
        'Noticia+Text',
        'Noto+Sans',
        'Noto+Serif',
        'Nova+Cut',
        'Nova+Flat',
        'Nova+Mono',
        'Nova+Oval',
        'Nova+Round',
        'Nova+Script',
        'Nova+Slim',
        'Nova+Square',
        'NTR',
        'Numans',
        'Nunito',
        'Odor+Mean+Chey',
        'Offside',
        'Old+Standard+TT',
        'Oldenburg',
        'Oleo+Script',
        'Oleo+Script+Swash+Caps',
        'Open+Sans',
        'Open+Sans+Condensed',
        'Oranienbaum',
        'Orbitron',
        'Oregano',
        'Orienta',
        'Original+Surfer',
        'Oswald',
        'Over+the+Rainbow',
        'Overlock',
        'Overlock+SC',
        'Ovo',
        'Oxygen',
        'Oxygen+Mono',
        'Pacifico',
        'Palanquin',
        'Palanquin+Dark',
        'Paprika',
        'Parisienne',
        'Passero+One',
        'Passion+One',
        'Pathway+Gothic+One',
        'Patrick+Hand',
        'Patrick+Hand+SC',
        'Patua+One',
        'Paytone+One',
        'Peddana',
        'Peralta',
        'Permanent+Marker',
        'Petit+Formal+Script',
        'Petrona',
        'Philosopher',
        'Piedra',
        'Pinyon+Script',
        'Pirata+One',
        'Plaster',
        'Play',
        'Playball',
        'Playfair+Display',
        'Playfair+Display+SC',
        'Podkova',
        'Poiret+One',
        'Poller+One',
        'Poly',
        'Pompiere',
        'Pontano+Sans',
        'Poppins',
        'Port+Lligat+Sans',
        'Port+Lligat+Slab',
        'Pragati+Narrow',
        'Prata',
        'Preahvihear',
        'Press+Start+2P',
        'Princess+Sofia',
        'Prociono',
        'Prosto+One',
        'PT+Mono',
        'PT+Sans',
        'PT+Sans+Caption',
        'PT+Sans+Narrow',
        'PT+Serif',
        'PT+Serif+Caption',
        'Puritan',
        'Purple+Purse',
        'Quando',
        'Quantico',
        'Quattrocento',
        'Quattrocento+Sans',
        'Questrial',
        'Quicksand',
        'Quintessential',
        'Qwigley',
        'Racing+Sans+One',
        'Radley',
        'Rajdhani',
        'Raleway',
        'Raleway+Dots',
        'Ramabhadra',
        'Ramaraja',
        'Rambla',
        'Rammetto+One',
        'Ranchers',
        'Rancho',
        'Ranga',
        'Rationale',
        'Ravi+Prakash',
        'Redressed',
        'Reenie+Beanie',
        'Revalia',
        'Rhodium+Libre',
        'Ribeye',
        'Ribeye+Marrow',
        'Righteous',
        'Risque',
        'Roboto',
        'Roboto+Condensed',
        'Roboto+Mono',
        'Roboto+Slab',
        'Rochester',
        'Rock+Salt',
        'Rokkitt',
        'Romanesco',
        'Ropa+Sans',
        'Rosario',
        'Rosarivo',
        'Rouge+Script',
        'Rozha+One',
        'Rubik',
        'Rubik+Mono+One',
        'Rubik+One',
        'Ruda',
        'Rufina',
        'Ruge+Boogie',
        'Ruluko',
        'Rum+Raisin',
        'Ruslan+Display',
        'Russo+One',
        'Ruthie',
        'Rye',
        'Sacramento',
        'Sahitya',
        'Sail',
        'Salsa',
        'Sanchez',
        'Sancreek',
        'Sansita+One',
        'Sarala',
        'Sarina',
        'Sarpanch',
        'Satisfy',
        'Scada',
        'Scheherazade',
        'Schoolbell',
        'Seaweed+Script',
        'Sevillana',
        'Seymour+One',
        'Shadows+Into+Light',
        'Shadows+Into+Light+Two',
        'Shanti',
        'Share',
        'Share+Tech',
        'Share+Tech+Mono',
        'Shojumaru',
        'Short+Stack',
        'Siemreap',
        'Sigmar+One',
        'Signika',
        'Signika+Negative',
        'Simonetta',
        'Sintony',
        'Sirin+Stencil',
        'Six+Caps',
        'Skranji',
        'Slabo+13px',
        'Slabo+27px',
        'Slackey',
        'Smokum',
        'Smythe',
        'Sniglet',
        'Snippet',
        'Snowburst+One',
        'Sofadi+One',
        'Sofia',
        'Sonsie+One',
        'Sorts+Mill+Goudy',
        'Source+Code+Pro',
        'Source+Sans+Pro',
        'Source+Serif+Pro',
        'Special+Elite',
        'Spicy+Rice',
        'Spinnaker',
        'Spirax',
        'Squada+One',
        'Sree+Krushnadevaraya',
        'Stalemate',
        'Stalinist+One',
        'Stardos+Stencil',
        'Stint+Ultra+Condensed',
        'Stint+Ultra+Expanded',
        'Stoke',
        'Strait',
        'Sue+Ellen+Francisco',
        'Sumana',
        'Sunshiney',
        'Supermercado+One',
        'Sura',
        'Suranna',
        'Suravaram',
        'Suwannaphum',
        'Swanky+and+Moo+Moo',
        'Syncopate',
        'Tangerine',
        'Taprom',
        'Tauri',
        'Teko',
        'Telex',
        'Tenali+Ramakrishna',
        'Tenor+Sans',
        'Text+Me+One',
        'The+Girl+Next+Door',
        'Tienne',
        'Tillana',
        'Timmana',
        'Tinos',
        'Titan+One',
        'Titillium+Web',
        'Trade+Winds',
        'Trocchi',
        'Trochut',
        'Trykker',
        'Tulpen+One',
        'Ubuntu',
        'Ubuntu+Condensed',
        'Ubuntu+Mono',
        'Ultra',
        'Uncial+Antiqua',
        'Underdog',
        'Unica+One',
        'UnifrakturCook',
        'UnifrakturMaguntia',
        'Unkempt',
        'Unlock',
        'Unna',
        'Vampiro+One',
        'Varela',
        'Varela+Round',
        'Vast+Shadow',
        'Vesper+Libre',
        'Vibur',
        'Vidaloka',
        'Viga',
        'Voces',
        'Volkhov',
        'Vollkorn',
        'Voltaire',
        'VT323',
        'Waiting+for+the+Sunrise',
        'Wallpoet',
        'Walter+Turncoat',
        'Warnes',
        'Wellfleet',
        'Wendy+One',
        'Wire+One',
        'Work+Sans',
        'Yanone+Kaffeesatz',
        'Yantramanav',
        'Yellowtail',
        'Yeseva+One',
        'Yesteryear',
        'Zeyada'
    );
    
    $safe_fonts = array(
        'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, "Lucida Grande", sans-serif',
        'Arial, Helvetica, sans-serif',
        'Arial Black, Gadget, sans-serif',
        'Bookman Old Style, serif',
        'Courier, monospace',
        'Courier New, Courier, monospace',
        'Garamond, serif',
        'Georgia, serif',
        'Impact, Charcoal, sans-serif',
        'Lucida Console, Monaco, monospace',
        'Lucida Grande, Lucida Sans Unicode, sans-serif',
        'MS Sans Serif, Geneva, sans-serif',
        'MS Serif, New York, sans-serif',
        'Palatino Linotype, Book Antiqua, Palatino, serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        'Comic Sans MS, cursive',
    );
    
    $output.= '<option data-type="" value="none">Select Font</option>';
    
    /* List Safe Fonts */
    foreach ($safe_fonts as $safe_font) {
        
        $output.= '<option data-type="safefont" ';
        if ($value == $safe_font) {
            $output.= ' selected="selected"';
        }
        $output.= " value='" . $safe_font . "' >- Safe Font - " . $safe_font . "</option>";
    }
    
    /* List Google Fonts */
    foreach ($google_webfonts as $google_webfont) {
        
        $output.= '<option data-type="google" ';
        if ($value == $google_webfont) {
            $output.= ' selected="selected"';
        }
        $output.= 'value="' . $google_webfont . '" >- Google Fonts - ' . str_replace('+', ' ', $google_webfont) . '</option>';
    }
    
    $output.= '</select>';
    
    $output.= '<script type="text/javascript">

                           mk_shortcode_fonts();

                </script>';
    
    return $output;
}
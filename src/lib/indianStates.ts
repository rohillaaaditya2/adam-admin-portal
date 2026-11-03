/**
 * Complete, standardized registry of all 28 States and 8 Union Territories of India
 * with major metropolitan/matrimonial hubs and international NRI options.
 */

export const ALL_INDIAN_STATES = [
  // 28 States
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // 8 Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi NCR',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
  // Global / NRI
  'Overseas / NRI'
] as const;

export interface StateCityGroup {
  group: string;
  options: { label: string; value: string }[];
}

export const INDIAN_STATES_AND_CITIES_GROUPS: StateCityGroup[] = [
  {
    group: '⭐ All India (Pan-India)',
    options: [
      { label: 'All India (All 28 States & 8 UTs)', value: 'All India' },
    ]
  },
  {
    group: '🏛️ Central India (MP & Chhattisgarh)',
    options: [
      { label: 'Madhya Pradesh (Indore, Bhopal, Jabalpur, Gwalior, Ujjain)', value: 'Madhya Pradesh' },
      { label: 'Chhattisgarh (Raipur, Bilaspur, Bhilai, Durg)', value: 'Chhattisgarh' },
    ]
  },
  {
    group: '🌴 South India (Kerala, TN, Karnataka, AP, Telangana, Goa)',
    options: [
      { label: 'Kerala (Kochi, Kottayam, Thrissur, Trivandrum, Kozhikode)', value: 'Kerala' },
      { label: 'Tamil Nadu (Chennai, Coimbatore, Madurai, Tiruchirappalli)', value: 'Tamil Nadu' },
      { label: 'Karnataka (Bengaluru, Mangaluru, Mysuru, Hubballi)', value: 'Karnataka' },
      { label: 'Telangana (Hyderabad, Secunderabad, Warangal)', value: 'Telangana' },
      { label: 'Andhra Pradesh (Visakhapatnam, Vijayawada, Guntur)', value: 'Andhra Pradesh' },
      { label: 'Goa (Panaji, Margao, Vasco da Gama, Mapusa)', value: 'Goa' },
      { label: 'Puducherry (Pondicherry, Karaikal)', value: 'Puducherry' },
    ]
  },
  {
    group: '🏢 West India (Maharashtra, Gujarat, Rajasthan)',
    options: [
      { label: 'Maharashtra (Mumbai, Pune, Nagpur, Thane, Nashik)', value: 'Maharashtra' },
      { label: 'Gujarat (Ahmedabad, Surat, Vadodara, Rajkot)', value: 'Gujarat' },
      { label: 'Rajasthan (Jaipur, Jodhpur, Udaipur, Kota)', value: 'Rajasthan' },
      { label: 'Dadra and Nagar Haveli and Daman and Diu', value: 'Daman & Diu' },
    ]
  },
  {
    group: '🌆 North India & NCR (Delhi, UP, Punjab, Haryana, HP, UK, J&K)',
    options: [
      { label: 'Delhi NCR (New Delhi, Noida, Gurugram, Faridabad, Ghaziabad)', value: 'Delhi NCR' },
      { label: 'Uttar Pradesh (Lucknow, Kanpur, Agra, Varanasi, Prayagraj, Noida)', value: 'Uttar Pradesh' },
      { label: 'Punjab (Chandigarh, Ludhiana, Amritsar, Jalandhar, Patiala)', value: 'Punjab' },
      { label: 'Haryana (Gurugram, Faridabad, Panipat, Karnal, Ambala)', value: 'Haryana' },
      { label: 'Chandigarh (UT)', value: 'Chandigarh' },
      { label: 'Uttarakhand (Dehradun, Haridwar, Roorkee, Nainital)', value: 'Uttarakhand' },
      { label: 'Himachal Pradesh (Shimla, Dharamshala, Solan, Mandi)', value: 'Himachal Pradesh' },
      { label: 'Jammu and Kashmir (Srinagar, Jammu)', value: 'Jammu and Kashmir' },
      { label: 'Ladakh (Leh, Kargil)', value: 'Ladakh' },
    ]
  },
  {
    group: '🏞️ East India (West Bengal, Bihar, Jharkhand, Odisha)',
    options: [
      { label: 'West Bengal (Kolkata, Siliguri, Asansol, Durgapur, Howrah)', value: 'West Bengal' },
      { label: 'Bihar (Patna, Gaya, Bhagalpur, Muzaffarpur)', value: 'Bihar' },
      { label: 'Jharkhand (Ranchi, Jamshedpur, Dhanbad, Bokaro)', value: 'Jharkhand' },
      { label: 'Odisha (Bhubaneswar, Cuttack, Rourkela, Berhampur)', value: 'Odisha' },
      { label: 'Andaman and Nicobar Islands (Port Blair)', value: 'Andaman & Nicobar' },
    ]
  },
  {
    group: '🌄 Northeast India (Assam, Meghalaya, Nagaland, Mizoram, Manipur, etc.)',
    options: [
      { label: 'Assam (Guwahati, Silchar, Dibrugarh, Jorhat)', value: 'Assam' },
      { label: 'Meghalaya (Shillong, Tura, Jowai)', value: 'Meghalaya' },
      { label: 'Nagaland (Kohima, Dimapur, Mokokchung)', value: 'Nagaland' },
      { label: 'Mizoram (Aizawl, Lunglei, Champhai)', value: 'Mizoram' },
      { label: 'Manipur (Imphal, Churachandpur)', value: 'Manipur' },
      { label: 'Tripura (Agartala, Dharmanagar)', value: 'Tripura' },
      { label: 'Arunachal Pradesh (Itanagar, Naharlagun)', value: 'Arunachal Pradesh' },
      { label: 'Sikkim (Gangtok, Namchi)', value: 'Sikkim' },
    ]
  },
  {
    group: '✈️ Overseas / Global NRI',
    options: [
      { label: 'Gulf Countries (UAE / Dubai, Saudi Arabia, Qatar, Kuwait, Oman)', value: 'Gulf / NRI' },
      { label: 'USA & Canada', value: 'USA / Canada' },
      { label: 'UK & Europe', value: 'UK / Europe' },
      { label: 'Australia & New Zealand', value: 'Australia / NZ' },
      { label: 'Other International NRI', value: 'Other Overseas' },
    ]
  }
];

export const STATES_CHOICES_STRING = ALL_INDIAN_STATES.join('|');

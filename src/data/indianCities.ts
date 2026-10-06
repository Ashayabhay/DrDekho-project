export interface CityStateInfo {
  city: string;
  state: string;
  isPopular?: boolean;
}

export const INDIAN_STATES_AND_CITIES: { state: string; cities: string[] }[] = [
  {
    state: 'Rajasthan',
    cities: [
      'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Sikar', 
      'Bhilwara', 'Sri Ganganagar', 'Pali', 'Bharatpur', 'Chittorgarh', 'Hanumangarh', 
      'Tonk', 'Beawar', 'Kishangarh', 'Jhunjhunu', 'Sawai Madhopur', 'Churu'
    ],
  },
  {
    state: 'Delhi NCR',
    cities: ['New Delhi', 'Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad', 'Greater Noida'],
  },
  {
    state: 'Bihar',
    cities: [
      'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 
      'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Bettiah', 
      'Saharsa', 'Sasaram', 'Hajipur', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 
      'Buxar', 'Kishanganj', 'Sitamarhi', 'Jamalpur', 'Jehanabad', 'Aurangabad', 'Bagaha', 
      'Lakhisarai', 'Gopalganj', 'Madhubani', 'Samastipur', 'Banka', 'Jamui', 'Supual'
    ],
  },
  {
    state: 'Maharashtra',
    cities: [
      'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad (Chhatrapati Sambhajinagar)', 
      'Solapur', 'Amravati', 'Kolhapur', 'Navi Mumbai', 'Sangli', 'Nanded', 'Jalgaon', 
      'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Ichalkaranji'
    ],
  },
  {
    state: 'Karnataka',
    cities: [
      'Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi-Dharwad', 'Belagavi', 'Davanagere', 
      'Ballari', 'Kalaburagi', 'Shivamogga', 'Tumakuru', 'Bidar', 'Hospet', 'Raichur', 
      'Udupi', 'Robertsonpet', 'Bhadravati', 'Chitradurga', 'Kolar'
    ],
  },
  {
    state: 'Gujarat',
    cities: [
      'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 
      'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Nadiad', 'Surendranagar', 'Bharuch', 
      'Mehsana', 'Bhuj', 'Porbandar', 'Palanpur', 'Valsad', 'Vapi'
    ],
  },
  {
    state: 'Uttar Pradesh',
    cities: [
      'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Meerut', 'Bareilly', 
      'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Jhansi', 'Mathura', 'Muzaffarnagar', 
      'Firozabad', 'Ayodhya', 'Budaun', 'Rampur', 'Shahjahanpur', 'Farrukhabad'
    ],
  },
  {
    state: 'Telangana',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet'],
  },
  {
    state: 'Tamil Nadu',
    cities: [
      'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 
      'Vellore', 'Tirunelveli', 'Thanjavur', 'Tuticorin', 'Dindigul', 'Cuddalore', 
      'Kanchipuram', 'Nagercoil', 'Hosur', 'Kumbakonam'
    ],
  },
  {
    state: 'West Bengal',
    cities: [
      'Kolkata', 'Siliguri', 'Asansol', 'Durgapur', 'Howrah', 'Bardhaman', 'Malda', 
      'Kharagpur', 'Haldia', 'Raiganj', 'Baharampur', 'Midnapore', 'Habra', 'Jalpaiguri'
    ],
  },
  {
    state: 'Punjab',
    cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur', 'Batala', 'Moga', 'Abohar'],
  },
  {
    state: 'Haryana',
    cities: ['Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa'],
  },
  {
    state: 'Madhya Pradesh',
    cities: [
      'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 
      'Ratlam', 'Rewa', 'Murwara (Katni)', 'Singrauli', 'Burhanpur', 'Khandwa', 'Morena', 'Bhind'
    ],
  },
  {
    state: 'Jharkhand',
    cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda'],
  },
  {
    state: 'Odisha',
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda'],
  },
  {
    state: 'Chhattisgarh',
    cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Durg', 'Jagdalpur', 'Ambikapur', 'Raigarh', 'Dhamtari'],
  },
  {
    state: 'Kerala',
    cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Palakkad', 'Kottayam', 'Malappuram'],
  },
  {
    state: 'Uttarakhand',
    cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rishikesh', 'Rudrapur', 'Kashipur', 'Nainital', 'Pithoragarh'],
  },
  {
    state: 'Assam',
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj'],
  },
  {
    state: 'Himachal Pradesh',
    cities: ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Kullu', 'Bilaspur (HP)', 'Hamirpur', 'Chamba'],
  },
  {
    state: 'Jammu & Kashmir',
    cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Sopore', 'Rajouri'],
  },
  {
    state: 'Goa',
    cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  },
  {
    state: 'Chandigarh (UT)',
    cities: ['Chandigarh'],
  },
  {
    state: 'Puducherry',
    cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  },
  {
    state: 'North-East States',
    cities: ['Imphal', 'Shillong', 'Aizawl', 'Agartala', 'Kohima', 'Gangtok', 'Itanagar', 'Port Blair'],
  },
];

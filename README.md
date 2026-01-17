## Inspiration
I sometimes wonder if there is a way to eliminate the need to go through the same Q&A just to re-order at a restaurant. Or how much anxiety you get ordering when trying out a new restaurant. Additionally, having worked at a small restaurant with limited staff and a small kitchen during peek hours, I wished I could spend less time switching from preparing food and taking orders. 

The food industry are brick & mortar restaurants, some are at food-courts, food trucks, and tiny spots/hole in the wall that does not have the kitchen size to serve food delivery apps like Uber eats, Doordash, and SkiptheDishes. It might be helpful to have a way to automate ordering without adding complexity for these businesses. 

## What it does
*QuickQR Order* aims to 
- help small restaurants automate their order system without opting for complex systems, 
- allow short-staffed teams focus on preparing the food during busy hours, 
- allow regular customers to save time when ordering their regular orders
- allow new customers to feel less anxiety when trying out new restaurants
- allow a business to keep their existing POS system since customers pay in-person
- promote in-person ordering which has been impacted by recent technological advances of food delivery apps and not to mention the current economic issues. 

This differs from existing QR code menu apps only display the menu list or food delivery apps because it does not require extra POS setup. It is way to automate without the extra costs. å
## How we built it

Stakeholders
- A: Restaurant Admin
- RS: Restaurant Staff
- C: Customer
- S: System

Functional Requirements
- A must be able to CRUD menu items into their menu. Each menu item will have a name, description, price and image maybe
- A/RS must be able to CRUD an account for their restaurant
- C msut be able to CRUD their own account
- C must be able to CRUD to a cart with the constraint that each cart will only contain items for a single restaurant at a time. Hence when C wants to add an item from another restaurant the cart will be reset
- C must be able to CRUD orders from cart for future purchases. C will be able to browse through the list by restaurant and/or by most recent purchase
- When C is ready, the app will generate a QR code to be scanned in-person at the restaurant. QR code will have an expiry date ( milliseconds after scan, or after 15 mins)
- When QR code has been scanned at the restaurant, 
RS will be redirected to a page containing a breakdown of the order which includes the menu-items on a list, and price breakdown. The RS will need to confirm the order manually
   - Confirmed: A webhook will be exposed for restaurant management system to sync the order
   - No action

Tech Stack
- Nextjs
- Supabase (Auth, DB, Storage)
- TailwindCSS, Shadcn-UI
- Vercel

## Challenges we ran into
- With the limited time it is not possible to integrate to existing restaurant management softwares
- A problem that the service faces is spamming the scanning of the QR code which can cause a restaurant to have backed up orders or a huge list of orders that will not be payed for. 
## Accomplishments that we're proud of

## What we learned

## What's next for QuickQR Order

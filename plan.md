legend:
- pending
* doing
+ done
? decision needed

now:
- better mobile styles
- debug 23s+ load times on app.js
- lists with no active todos should be in a seperate "completed" sidebar section
- show better drag preview on mobile
- tests
  - can register
  - can log in
  - can't log in with incorrect password
  - can't view other people's list
  - can view publically shared list
  - can view privately shared list
- (dan) properly handle 'all' when dragging todo items
- (dan) remove from current list when dropping todo item
- (dan) new page should show the pending list in the sidebar
- (dan) counter next to each list
- (dan) alphabetize lists
- (dan) new page should clear todo list
* (josh) supprt read only lists
  * public
  - private
- (josh) support sublists
- (josh) allow removing list from todo on mobile
- (josh) support links in todo body
? (josh) when viewing list, filter out labels for current list
+ (josh) re-order todos in list
+ (josh) make drag and drop work on mobile
+ (josh) remove from list when removing list tag
+ (josh) show faded dummy content while loading
+ (josh) allow removing lists with button
+ (josh) mvp mobile styles
+ (josh) improve single todo editor styles
+ (josh) todos must have some content
+ (josh) remove chess page
+ (josh) review state stores
+ (josh) support links in todo title
soonish:
- (josh) enable babel-preset-env and compress production app.js
- (dan) better signup page
- offline friendly progressive web app
- better drag and drop UI
later:
- support partial import from wunderlist with UI
- support google keep import
- extra auth:
  - google
  - twitter
  - github (can we have nice github integration? issues perhaps?)
  - reddit?
- change password
- setting to change sort order of lists
- todo attachments
- sharable read only list links
- todo deadlines (red if past)

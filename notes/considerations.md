# Considerations

## Creating a Higher Order Component Function for Map
### Map as a component
Map as a component did not work out well due to the fact that, it resulted in passing down callback methods from the parent component to map component to be able to retrieve map objects such as an instance of JMap.Controller which is required to control and retrieve data about the map. This results in a data flow  like below

								 |----->APP----|
								 |             v
	Children:	  				MAP	       Other Components...  
	

Since This is not linear, it is not ideal and leads to needless complexity. It also, results in observing props in the Map Component to detect if new props were passed and to run the methods matching those props in. i.e, if destination was updated, you would run showDestination.


### Creating a JibeStream Map Service which gets used through Dependency Injection
The main concern with this was regarding re-usability. If we create a service, and at some point we need to factor in tracking multiple maps on the same page. It would become very problematic as it would require tracking each instance info separately and passing along the identifier in all the methods so the service would know which instance to update. Also, a DI service could lead to unclear communication as it can be injected anywhere. So the data flow could become more confusing.



### Higher Order Component Function
The benefit of this approach is that you can re-use the map component and keep the data flow linear. As you can wrap the component which would normally be a parent of the map component. And, allow the map component to be the parent of that component and pass in all methods that are used to update the state and retrieve data regarding the map under prop called "map". And in doing so, you can provide a single point of entry which would provide the wrapper API for the JibeStream Maps. The linear data flow looks like the following

										MAP Wrapper Component
												 |
												 v
						 			  	 Parent Component
												 |
												 v
 						  				Other Components...  


### Redux
Redux was not needed for this application. Also by introducing redux, we remove re-usability aspect of the map component. As much logic regarding that will be moved into redux

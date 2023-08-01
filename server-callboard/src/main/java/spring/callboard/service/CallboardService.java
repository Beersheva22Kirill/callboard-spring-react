package spring.callboard.service;

import java.io.*;
import java.util.*;
import org.springframework.stereotype.Service;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import spring.callboard.exceptions.NotFoundException;
import spring.callboard.model.CallBoardDataObject;


@Data
@Service
@Slf4j
public class CallboardService implements Board{
	

	private static final long serialVersionUID = 1L;
	
	private HashMap<Integer, CallBoardDataObject> idMap;
	private HashMap<String, Set<CallBoardDataObject>> categoryMap;
	private TreeMap<Float, Set<CallBoardDataObject>> priceMap;
	private int lastId;
	
	
	public CallboardService() {
		this.idMap = new HashMap<Integer, CallBoardDataObject>();
		this.categoryMap = new HashMap<String, Set<CallBoardDataObject>>();
		this.priceMap = new TreeMap<Float, Set<CallBoardDataObject>>();
		this.lastId = 0;
	}
		
	
	@Override
	public Integer addFromClient(CallBoardDataObject object) {
		int id;
		synchronized (idMap) {
			id = ++lastId;
			log.debug("Initial id: " + id);
			object.setId(id);
			idMap.put(id, object);
			addOtherMap(categoryMap, object.getCategory(), object);
			addOtherMap(priceMap, Float.valueOf(object.getPrice()), object);
			log.debug("Object with id: " + id + " added");
		}	
		return id;
	}
	
	private <T> void addOtherMap(Map<T, Set<CallBoardDataObject>> map, T key, CallBoardDataObject object) {
		map.computeIfAbsent(key, k->new HashSet<>()).add(object);
		
	}
	
	@Override
	public List<CallBoardDataObject> getAll() {
		
		return new LinkedList<CallBoardDataObject>(idMap.values());
	}
	
	@Override
	public CallBoardDataObject getById(Integer id) {
		
		return idMap.get(id);
	}
	
	@Override
	public List<CallBoardDataObject> getByCategory(String category) {
		List<CallBoardDataObject> result;
		Set<CallBoardDataObject> set = categoryMap.get(category);
		if (set != null ) {
			result = new LinkedList<CallBoardDataObject>(set);
		} else {
			throw new NotFoundException("Category:" + category + " not found");
		}
		return result;
	}

	@Override
	public List<CallBoardDataObject> getByPrice(Float price, boolean before) {
		SortedMap<Float, Set<CallBoardDataObject>> map;
		if (before) {
			 map = priceMap.subMap(0f,true, price, true);
		} else {
			 map = priceMap.subMap(price,true, priceMap.lastKey(),true);
		}
		return map.values().stream().flatMap(Set::stream).toList();
	}

	


	
	@Override
	public CallBoardDataObject removeAdvert(Integer id) {
		CallBoardDataObject removed = getById(id);
		if(removed != null) {
			removedToOtherMaps(categoryMap, removed.getCategory(), removed);
			removedToOtherMaps(priceMap, removed.getPrice(), removed);
			idMap.remove(removed.getId());
			log.debug("Object with id " + removed.getId() + " removed");
		} else {
			throw new NotFoundException("Object with id:" + id + " not found");
		}
		return removed;
	}
	
	private <T> void removedToOtherMaps(Map<T, Set<CallBoardDataObject>> map, T key, CallBoardDataObject object) {
		Set<CallBoardDataObject> set = map.get(key);
		set.remove(object);
		if (set.isEmpty()) {
			map.remove(key);
		}	
	}
	
	@Override
	public CallBoardDataObject updateAdvert(Integer id, CallBoardDataObject newAdvert) {
		
		CallBoardDataObject updateObject = getById(id);
		if (updateObject != null) {
			updateObject.setCategory(newAdvert.getCategory());
			updateObject.setData(newAdvert.getData());
			updateObject.setName(newAdvert.getName());
			updateObject.setPrice(newAdvert.getPrice());
			
			log.debug("Object wjth id: " + id + " updated on " + updateObject);
		}else {
			throw new NotFoundException("Object with id:" + id + " not found");
		}

		return updateObject;
	}
	
	@Override
	public void save(String path) {
		try(ObjectOutputStream os = new ObjectOutputStream(new FileOutputStream(path))){
			os.writeObject(this.getAll());
			log.info("Save in file: " + path + " completed");
		} catch (IOException e) {
			log.error(e.getMessage());
		}
		
	}

	@Override
	public void restore(String path) {	
		
	List<CallBoardDataObject> adv = new ArrayList<>();
	log.info("Begin of restore from:" + path);
	try(ObjectInputStream is = new ObjectInputStream(new FileInputStream(path))) {
		adv = (List<CallBoardDataObject>) is.readObject(); 
		} catch (FileNotFoundException e) {
			log.error(e.getMessage());
			} catch (IOException e) {
				log.error(e.getMessage());
				}catch (ClassNotFoundException e) {
					log.error(e.getMessage());
				}
	
		Iterator<CallBoardDataObject> iterator = adv.iterator();
			while (iterator.hasNext()) {
				this.addFromFile(iterator.next());
		
			}
			log.info("Restore from:" + path + " compete. Last id = " + this.lastId);
	}

	@Override
	public void addFromFile(CallBoardDataObject object) {
		if (this.lastId < Integer.valueOf(object.getId())) {
			this.lastId = Integer.valueOf(object.getId());
		}
		idMap.put(object.getId(), object);
		addOtherMap(categoryMap, object.getCategory(), object);
		addOtherMap(priceMap, Float.valueOf(object.getPrice()), object);
		
	}
	







}

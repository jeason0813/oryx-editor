//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.1-b02-fcs 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2009.08.07 at 02:01:49 PM CEST 
//


package de.hpi.bpmn2_0.model;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElementRef;
import javax.xml.bind.annotation.XmlIDREF;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for tLane complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="tLane">
 *   &lt;complexContent>
 *     &lt;extension base="{http://schema.omg.org/spec/BPMN/2.0}tBaseElement">
 *       &lt;sequence>
 *         &lt;element name="partitionElement" type="{http://schema.omg.org/spec/BPMN/2.0}tBaseElement" minOccurs="0"/>
 *         &lt;element name="flowElementRef" type="{http://www.w3.org/2001/XMLSchema}IDREF" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="childLaneSet" type="{http://schema.omg.org/spec/BPMN/2.0}tLaneSet" minOccurs="0"/>
 *       &lt;/sequence>
 *       &lt;attribute name="name" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="partitionElementRef" type="{http://www.w3.org/2001/XMLSchema}IDREF" />
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "tLane", propOrder = {
    "partitionElement",
    "flowElementRef",
    "childLaneSet"
})
public class TLane
    extends TBaseElement
{

    protected TBaseElement partitionElement;
    @XmlElementRef(name = "flowElementRef", namespace = "http://schema.omg.org/spec/BPMN/2.0", type = JAXBElement.class)
    protected List<JAXBElement<Object>> flowElementRef;
    protected TLaneSet childLaneSet;
    @XmlAttribute
    protected String name;
    @XmlAttribute
    @XmlIDREF
    @XmlSchemaType(name = "IDREF")
    protected Object partitionElementRef;

    /**
     * Gets the value of the partitionElement property.
     * 
     * @return
     *     possible object is
     *     {@link TBaseElement }
     *     
     */
    public TBaseElement getPartitionElement() {
        return partitionElement;
    }

    /**
     * Sets the value of the partitionElement property.
     * 
     * @param value
     *     allowed object is
     *     {@link TBaseElement }
     *     
     */
    public void setPartitionElement(TBaseElement value) {
        this.partitionElement = value;
    }

    /**
     * Gets the value of the flowElementRef property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the flowElementRef property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getFlowElementRef().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link JAXBElement }{@code <}{@link Object }{@code >}
     * 
     * 
     */
    public List<JAXBElement<Object>> getFlowElementRef() {
        if (flowElementRef == null) {
            flowElementRef = new ArrayList<JAXBElement<Object>>();
        }
        return this.flowElementRef;
    }

    /**
     * Gets the value of the childLaneSet property.
     * 
     * @return
     *     possible object is
     *     {@link TLaneSet }
     *     
     */
    public TLaneSet getChildLaneSet() {
        return childLaneSet;
    }

    /**
     * Sets the value of the childLaneSet property.
     * 
     * @param value
     *     allowed object is
     *     {@link TLaneSet }
     *     
     */
    public void setChildLaneSet(TLaneSet value) {
        this.childLaneSet = value;
    }

    /**
     * Gets the value of the name property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setName(String value) {
        this.name = value;
    }

    /**
     * Gets the value of the partitionElementRef property.
     * 
     * @return
     *     possible object is
     *     {@link Object }
     *     
     */
    public Object getPartitionElementRef() {
        return partitionElementRef;
    }

    /**
     * Sets the value of the partitionElementRef property.
     * 
     * @param value
     *     allowed object is
     *     {@link Object }
     *     
     */
    public void setPartitionElementRef(Object value) {
        this.partitionElementRef = value;
    }

}
